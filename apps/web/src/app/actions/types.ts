/**
 * ACTION RESPONSE
 */
export interface ActionSuccessResponse {
  ok: true;
}

export interface ActionErrorResponse {
  ok: false;
  message: string;
}

export type ActionResponse = ActionSuccessResponse | ActionErrorResponse;
