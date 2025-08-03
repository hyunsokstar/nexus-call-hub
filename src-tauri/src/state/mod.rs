// C:\pilot-tauri\nexus-call-hub\src-tauri\src\state\mod.rs

pub mod auth_state;
pub mod queue_state;

// 모든 State 타입들을 re-export
pub use auth_state::{AuthState, User};
pub use queue_state::{AgentStatus, QueueState, QueueStatus};

// 모든 Commands를 re-export
pub use auth_state::{
    get_auth_state_debug, get_login_attempts, get_user, get_user_department, get_user_role,
    increment_login_attempts, is_authenticated, login_user, logout_user, reset_login_attempts,
    validate_user_session,
};

pub use queue_state::{
    get_all_agents, get_available_agents, get_busy_agents, get_queue_statistics, get_queue_status,
    update_agent_status, update_queue_status,
};
