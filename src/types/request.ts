import { Request as RequestExpress } from "express";

export type Request = RequestExpress & {
    userId: string;
};