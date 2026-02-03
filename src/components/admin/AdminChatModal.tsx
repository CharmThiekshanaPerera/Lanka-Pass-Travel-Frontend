import { useState, useEffect, useRef } from "react";
import {
    Send, Paperclip, Image as ImageIcon, X, Download, File,
    CheckCheck, AlertCircle, Clock, CheckCircle, XCircle,
    Maximize2, Shield, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { chatService, ChatMessage, UpdateRequest } from "@/services/chatService";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AdminChatModalProps {
    vendorId: string | null;
    businessName: string;
    vendorType: string;
    isOpen: boolean;
    onClose: () => void;
}

const UpdateRequestCard = ({
    message,
    onStatusChange
}: {
    message: ChatMessage,
    onStatusChange: () => void
}) => {
    const [request, setRequest] = useState<UpdateRequest | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectInput, setShowRejectInput] = useState(false);

    useEffect(() => {
        if (message.update_request_id && showDetails) {
            fetchRequest(message.update_request_id);
        }
    }, [message.update_request_id, showDetails]);

    const fetchRequest = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await chatService.getUpdateRequestById(id);
            if (res.success) {
                setRequest(res.request);
            }
        } catch (error) {
            console.error("Failed to fetch request:", error);
            toast.error("Could not load request details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!request) return;
        setIsActionLoading(true);
        try {
            await chatService.approveUpdateRequest(request.id);
            toast.success("Request approved");
            setRequest(prev => prev ? { ...prev, status: 'approved' } : null);
            onStatusChange();
        } catch (error: any) {
            toast.error(error.message || "Failed to approve");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!request) return;
        if (!rejectReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }
        setIsActionLoading(true);
        try {
            await chatService.rejectUpdateRequest(request.id, rejectReason);
            toast.success("Request rejected");
            setRequest(prev => prev ? { ...prev, status: 'rejected' } : null);
            setShowRejectInput(false);
            onStatusChange();
        } catch (error: any) {
            toast.error(error.message || "Failed to reject");
        } finally {
            setIsActionLoading(false);
        }
    };

    if (!message.update_request_id) return null;

    return (
        <Card className="mt-2 p-3 border-l-4 border-l-yellow-500 bg-yellow-50/50">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-yellow-600" />
                    <span className="font-semibold text-sm text-yellow-800">Profile Update Request</span>
                </div>
                {request && (
                    <Badge variant="outline" className={`
                        ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${request.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                        ${request.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                        {request.status.toUpperCase()}
                    </Badge>
                )}
            </div>

            <p className="text-sm mb-3">{message.message}</p>

            {!showDetails ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(true)}
                    className="w-full"
                >
                    <Eye className="h-4 w-4 mr-2" /> Review Changes
                </Button>
            ) : (
                <div className="space-y-3">
                    {isLoading ? (
                        <div className="flex justify-center p-2">
                            <div className="animate-spin h-4 w-4 border-2 border-primary rounded-full border-t-transparent" />
                        </div>
                    ) : request ? (
                        <div className="text-sm bg-white p-2 rounded border">
                            <div className="grid gap-2">
                                {request.changed_fields.map(field => (
                                    <div key={field} className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center text-xs">
                                        <div className="text-muted-foreground truncate" title={String(request.current_data[chatService.getDbKey(field)])}>
                                            {String(request.current_data[chatService.getDbKey(field)] || "(Empty)")}
                                        </div>
                                        <div className="text-muted-foreground">→</div>
                                        <div className="font-medium truncate" title={String(request.requested_data[chatService.getDbKey(field)])}>
                                            {String(request.requested_data[chatService.getDbKey(field)])}
                                        </div>
                                        <div className="col-span-3 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                            {chatService.formatFieldName(field)}
                                        </div>
                                        <div className="col-span-3 h-px bg-border my-1" />
                                    </div>
                                ))}

                            </div>

                            {request.status === 'pending' && (
                                <div className="mt-3 space-y-2">
                                    {showRejectInput ? (
                                        <div className="space-y-2">
                                            <Label>Rejection Reason</Label>
                                            <Textarea
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="Why are you rejecting this change?"
                                                className="h-20"
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowRejectInput(false)}
                                                    disabled={isActionLoading}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={handleReject}
                                                    disabled={isActionLoading}
                                                >
                                                    Confirm Reject
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                                onClick={handleApprove}
                                                disabled={isActionLoading}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => setShowRejectInput(true)}
                                                disabled={isActionLoading}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-destructive text-xs">Failed to load details</p>
                    )}
                </div>
            )}
        </Card>
    );
};

export const AdminChatModal = ({ vendorId, businessName, vendorType, isOpen, onClose }: AdminChatModalProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    // File refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && vendorId) {
            fetchMessages();
            // Poll for new messages every 10s
            const interval = setInterval(fetchMessages, 10000);
            return () => clearInterval(interval);
        } else {
            setMessages([]);
        }
    }, [isOpen, vendorId]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    const fetchMessages = async () => {
        if (!vendorId) return;
        try {
            const res = await chatService.getMessages(vendorId);
            if (res.success) {
                setMessages(res.messages);
            }
        } catch (error) {
            console.error("Fetch messages error:", error);
        }
    };

    const handleSendMessage = async () => {
        if (!vendorId || (!inputMessage.trim() && attachments.length === 0)) return;

        setIsSending(true);
        try {
            // Mock file upload logic for now
            const uploadedAttachments = attachments.map(file => ({
                name: file.name,
                url: URL.createObjectURL(file),
                type: file.type.startsWith("image/") ? "image" as const : "file" as const
            }));

            const res = await chatService.sendMessage(
                vendorId,
                inputMessage,
                uploadedAttachments.length > 0 ? uploadedAttachments : undefined
            );

            if (res.success) {
                setMessages(prev => [...prev, res.message]);
                setInputMessage("");
                setAttachments([]);
            }
        } catch (error: any) {
            toast.error("Failed to send message");
        } finally {
            setIsSending(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setAttachments(prev => [...prev, ...Array.from(files)]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const getMessageTypeIcon = (msg: ChatMessage) => {
        if (msg.message_type === "update_request") return <Clock className="h-3 w-3 text-yellow-500" />;
        if (msg.message_type === "system") {
            if (msg.message.includes("approved")) return <CheckCircle className="h-3 w-3 text-green-500" />;
            if (msg.message.includes("rejected")) return <XCircle className="h-3 w-3 text-red-500" />;
        }
        return null;
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-background z-10 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                    {businessName.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <DialogTitle className="text-base font-semibold flex items-center gap-2">
                                    {businessName}
                                    <Badge variant="outline" className="text-xs font-normal">
                                        {vendorType}
                                    </Badge>
                                </DialogTitle>
                                <DialogDescription className="text-xs">
                                    Chat Context: {vendorId}
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 bg-muted/30 relative flex flex-col min-h-0">
                    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                        <div className="space-y-4 pb-4">
                            {messages.length === 0 && !isLoading ? (
                                <div className="text-center text-muted-foreground text-sm py-10">
                                    No conversation history.
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>

                                            {msg.message_type !== 'text' && (
                                                <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                                                    {getMessageTypeIcon(msg)}
                                                    <span>
                                                        {msg.message_type === 'update_request' && 'Update Request'}
                                                        {msg.message_type === 'system' && 'System Notification'}
                                                    </span>
                                                </div>
                                            )}

                                            {msg.message_type === 'update_request' ? (
                                                <UpdateRequestCard
                                                    message={msg}
                                                    onStatusChange={fetchMessages}
                                                />
                                            ) : (
                                                <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.sender === 'admin'
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : msg.message_type === 'system'
                                                        ? 'bg-muted border border-border text-center w-full italic'
                                                        : 'bg-white border rounded-tl-none'
                                                    }`}>
                                                    <p className="whitespace-pre-wrap">{msg.message}</p>
                                                </div>
                                            )}

                                            {/* Attachments */}
                                            {msg.attachments && msg.attachments.length > 0 && (
                                                <div className="mt-1 space-y-1">
                                                    {msg.attachments.map((att, i) => (
                                                        <div key={i} className="text-xs bg-muted p-1 rounded flex items-center gap-1">
                                                            <File className="h-3 w-3" />
                                                            <a href={att.url} target="_blank" rel="noreferrer" className="underline truncate max-w-[150px]">
                                                                {att.name}
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <div className="p-4 border-t bg-background shrink-0">
                    {/* Attachments preview */}
                    {attachments.length > 0 && (
                        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                            {attachments.map((file, i) => (
                                <div key={i} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                                    <span className="truncate max-w-[100px]">{file.name}</span>
                                    <button onClick={() => removeAttachment(i)}><X className="h-3 w-3" /></button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2 items-end">
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            multiple
                            onChange={handleFileSelect}
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 shrink-0"
                            title="Attach file"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <div className="flex-1 relative">
                            <Textarea
                                placeholder="Type a message..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                className="min-h-[40px] max-h-[120px] resize-none py-2 pr-2"
                                rows={1}
                            />
                        </div>
                        <Button
                            size="icon"
                            className="h-10 w-10 shrink-0"
                            onClick={handleSendMessage}
                            disabled={isSending || (!inputMessage.trim() && attachments.length === 0)}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
