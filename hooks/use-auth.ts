/**
 * 认证状态 Hook
 *
 * 在任意客户端组件中使用：const { user, loading, signOut } = useAuth()
 *
 * 必须在 AuthProvider 内部使用（根 Layout 已全局包裹）。
 */
export { useAuthContext as useAuth } from "@/components/auth-provider";
