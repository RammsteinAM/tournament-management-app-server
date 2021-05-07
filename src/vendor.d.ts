declare namespace NodeJS  {
    interface Global {
        socket: import('socket.io').Server
    }
}