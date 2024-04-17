import {Request} from "express";
import {Socket} from "socket.io";

type AuthPayload = {
    userId : string,
    email: string,
}

export type RequestWithAuth = Request & AuthPayload;

export type SocketWithAuth = Socket & AuthPayload;
