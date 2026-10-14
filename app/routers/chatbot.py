from fastapi import APIRouter
from ..models.schemas import ChatRequest, ChatResponse
from ..services.chatbot_service import get_chatbot_reply

router = APIRouter(prefix="/api/chat", tags=["Agricultural AI Chatbot"])

@router.post("", response_model=ChatResponse)
def handle_chat_message(req: ChatRequest):
    return get_chatbot_reply(user_msg=req.message, lang=req.language)
