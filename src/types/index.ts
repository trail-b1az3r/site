export interface Repo { id:number; name:string; description:string|null; html_url:string; language:string|null; stargazers_count:number; forks_count:number; open_issues_count:number; size:number; pushed_at:string; fork:boolean; topics?:string[] }
export interface GhUser { login:string; name:string|null; bio:string|null; avatar_url:string; html_url:string; public_repos:number; followers:number }
export interface GhEvent { id:string; type:string; repo:{name:string}; created_at:string }
export interface HfModel { id:string; createdAt?:string; downloads?:number; likes?:number; tags?:string[]; pipeline_tag?:string; lastModified?:string; safetensors?:{total?:number} }
export interface Video { id:string; title:string; published:string; thumb:string; url:string }
export interface SteamSnap { name: string; avatar?: string; level?: number; counts: Record<string, number>; favoriteGame?: { name: string; hours?: number; url: string }; fetchedAt: string }
export interface RawRelease { tag_name: string; published_at: string; html_url: string; prerelease: boolean; draft: boolean; body: string }
export interface Live { generatedAt?: string; releases?: RawRelease[]; contributions: { total: number; days: { date: string; level: number; count: number }[] } | null; steam: SteamSnap | null; youtube: { channelId: string; name: string; videos: Video[] } }
