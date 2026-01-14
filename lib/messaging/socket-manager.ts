import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

export type SocketEvent = 
  | 'message:new'
  | 'message:status'
  | 'typing:start'
  | 'typing:stop'
  | 'user:online'
  | 'user:offline'

export type SocketEmitEvent =
  | 'message:sent'
  | 'message:delivered'
  | 'message:read'
  | 'typing:start'
  | 'typing:stop'

/**
 * Socket Manager
 * Professional WebSocket connection management with auto-reconnect
 */
class SocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private isManualDisconnect = false

  /**
   * Connect to socket server
   */
  connect(): Socket {
    if (this.socket?.connected) {
      console.log('[SocketManager] Already connected')
      return this.socket
    }

    console.log('[SocketManager] Connecting to:', SOCKET_URL)

    this.socket = io(SOCKET_URL, {
      withCredentials: true, // Send cookies (access token)
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })

    this.setupConnectionHandlers()

    return this.socket
  }

  /**
   * Setup connection event handlers
   */
  private setupConnectionHandlers() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('[SocketManager] ✅ Connected - ID:', this.socket?.id)
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketManager] ❌ Disconnected - Reason:', reason)

      // Auto-reconnect unless manual disconnect
      if (!this.isManualDisconnect && reason === 'io server disconnect') {
        console.log('[SocketManager] 🔄 Server disconnected, reconnecting...')
        this.socket?.connect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('[SocketManager] ❌ Connection error:', error.message)
      this.reconnectAttempts++

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[SocketManager] ❌ Max reconnect attempts reached')
      }
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('[SocketManager] 🔄 Reconnected after', attemptNumber, 'attempts')
    })

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('[SocketManager] 🔄 Reconnect attempt:', attemptNumber)
    })

    this.socket.on('reconnect_failed', () => {
      console.error('[SocketManager] ❌ Reconnection failed')
    })
  }

  /**
   * Listen to socket event
   */
  on(event: SocketEvent, callback: (data: any) => void) {
    if (!this.socket) {
      console.error('[SocketManager] Socket not initialized')
      return
    }

    this.socket.on(event, callback)
  }

  /**
   * Remove socket event listener
   */
  off(event: SocketEvent, callback?: (data: any) => void) {
    if (!this.socket) return

    if (callback) {
      this.socket.off(event, callback)
    } else {
      this.socket.off(event)
    }
  }

  /**
   * Emit socket event
   */
  emit(event: SocketEmitEvent, data: any) {
    if (!this.socket?.connected) {
      console.error('[SocketManager] Cannot emit - socket not connected')
      return false
    }

    this.socket.emit(event, data)
    return true
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (!this.socket) return

    console.log('[SocketManager] Disconnecting...')
    this.isManualDisconnect = true
    this.socket.disconnect()
    this.socket = null
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return !!this.socket?.connected
  }

  /**
   * Get socket instance
   */
  getSocket(): Socket | null {
    return this.socket
  }
}

// Export singleton instance
export const socketManager = new SocketManager()

// Expose to window for debugging
if (typeof window !== 'undefined') {
  (window as any).socketManager = socketManager
}
