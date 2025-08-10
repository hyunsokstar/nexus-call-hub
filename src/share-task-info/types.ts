export type SaveRequest = {
  text: string;
  title?: string;
  domain?: string;
  meta?: {
    stack?: string[];
    frontend?: string[];
    backend?: string[];
    devops?: string[];
    tags?: string[];
    version?: string;
    githubUrl?: string;
    dependencies?: string[];
    features?: string[];
    author?: string;
    isBoilerplate?: boolean;
    public?: boolean;
  };
};