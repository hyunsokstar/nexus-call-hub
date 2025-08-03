// C:\pilot-tauri\nexus-call-hub\src-tauri\src\state\queue_state.rs
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{AppHandle, Emitter};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QueueStatus {
    pub inbound_waiting: u32,
    pub inbound_agents_available: u32,
    pub inbound_agents_total: u32,
    pub outbound_active_campaigns: u32,
    pub outbound_calls_in_progress: u32,
    pub outbound_calls_today: u32,
}

impl Default for QueueStatus {
    fn default() -> Self {
        Self {
            inbound_waiting: 0,
            inbound_agents_available: 0,
            inbound_agents_total: 0,
            outbound_active_campaigns: 0,
            outbound_calls_in_progress: 0,
            outbound_calls_today: 0,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentStatus {
    pub id: String,
    pub name: String,
    pub status: String, // "available", "busy", "break", "offline"
    pub current_call: Option<String>,
    pub call_duration: Option<u32>,
}

// 대기열 관련 상태
#[derive(Default)]
pub struct QueueState {
    pub queue_status: Mutex<QueueStatus>,
    pub agents: Mutex<Vec<AgentStatus>>,
    pub last_updated: Mutex<Option<String>>,
}

// === 대기열 관련 Tauri Commands ===

#[tauri::command]
pub fn update_queue_status(
    app: AppHandle,
    state: tauri::State<QueueState>,
    status: QueueStatus,
) -> Result<(), String> {
    // 1. 상태 업데이트
    *state.queue_status.lock().unwrap() = status.clone();
    *state.last_updated.lock().unwrap() = Some(chrono::Utc::now().to_rfc3339());

    // 2. 모든 윈도우에 대기열 상태 변경 이벤트 발송
    app.emit("queue-status-updated", &status)
        .map_err(|e| e.to_string())?;

    println!("📊 [QUEUE] 대기열 상태 업데이트");
    Ok(())
}

#[tauri::command]
pub fn get_queue_status(state: tauri::State<QueueState>) -> QueueStatus {
    state.queue_status.lock().unwrap().clone()
}

#[tauri::command]
pub fn update_agent_status(
    app: AppHandle,
    state: tauri::State<QueueState>,
    agent: AgentStatus,
) -> Result<(), String> {
    let mut agents = state.agents.lock().unwrap();

    // 기존 상담원 찾아서 업데이트 또는 새로 추가
    if let Some(existing_agent) = agents.iter_mut().find(|a| a.id == agent.id) {
        *existing_agent = agent.clone();
    } else {
        agents.push(agent.clone());
    }

    // 모든 윈도우에 상담원 상태 변경 이벤트 발송
    app.emit("agent-status-updated", &agent)
        .map_err(|e| e.to_string())?;

    println!(
        "👤 [QUEUE] 상담원 상태 업데이트: {} -> {}",
        agent.name, agent.status
    );
    Ok(())
}

#[tauri::command]
pub fn get_all_agents(state: tauri::State<QueueState>) -> Vec<AgentStatus> {
    state.agents.lock().unwrap().clone()
}

#[tauri::command]
pub fn get_available_agents(state: tauri::State<QueueState>) -> Vec<AgentStatus> {
    state
        .agents
        .lock()
        .unwrap()
        .iter()
        .filter(|agent| agent.status == "available")
        .cloned()
        .collect()
}

#[tauri::command]
pub fn get_busy_agents(state: tauri::State<QueueState>) -> Vec<AgentStatus> {
    state
        .agents
        .lock()
        .unwrap()
        .iter()
        .filter(|agent| agent.status == "busy")
        .cloned()
        .collect()
}

// 실시간 통계 계산
#[tauri::command]
pub fn get_queue_statistics(state: tauri::State<QueueState>) -> serde_json::Value {
    let queue_status = state.queue_status.lock().unwrap().clone();
    let agents = state.agents.lock().unwrap();

    let available_count = agents.iter().filter(|a| a.status == "available").count();
    let busy_count = agents.iter().filter(|a| a.status == "busy").count();
    let break_count = agents.iter().filter(|a| a.status == "break").count();
    let offline_count = agents.iter().filter(|a| a.status == "offline").count();

    serde_json::json!({
        "queue_status": queue_status,
        "agent_summary": {
            "total": agents.len(),
            "available": available_count,
            "busy": busy_count,
            "break": break_count,
            "offline": offline_count
        },
        "last_updated": state.last_updated.lock().unwrap().clone()
    })
}
