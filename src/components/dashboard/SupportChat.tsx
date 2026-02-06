import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Image as ImageIcon, X, Download, File, CheckCheck, AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { chatService, ChatMessage, UpdateRequest } from "@/services/chatService";
import { useAuth } from "@/contexts/AuthContext";

interface SupportChatTabProps {
    vendorId?: string;
}

const SupportChatTab = ({ vendorId }: SupportChatTabProps) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [pendingRequests, setPendingRequests] = useState<UpdateRequest[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Determine the vendor ID (from props or from user's vendor profile)
    const [activeVendorId, setActiveVendorId] = useState<string | null>(vendorId || null);

    // Fetch vendor ID if not provided
    useEffect(() => {
        const fetchVendorId = async () => {
            if (vendorId) {
                setActiveVendorId(vendorId);
                return;
            }

            // For vendors, get their own vendor ID
            if (user?.role === "vendor") {
                try {
                    const { vendorService } = await import("@/services/vendorService");
                    const profile = await vendorService.getVendorProfile();
                    if (profile?.vendor?.id) {
                        setActiveVendorId(profile.vendor.id);
                    }
                } catch (error) {
                    console.error("Failed to fetch vendor profile:", error);
                    toast.error("Failed to load chat - could not find vendor profile");
                }
            }
        };

        fetchVendorId();
    }, [vendorId, user]);

    // Fetch messages when vendor ID is available
    useEffect(() => {
        if (!activeVendorId) return;

        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const response = await chatService.getMessages(activeVendorId);
                if (response.success) {
                    setMessages(response.messages);
                }
            } catch (error: any) {
                console.error("Failed to fetch messages:", error);
                // Don't show error toast for MongoDB unavailable (might be expected)
                if (!error.message?.includes("unavailable")) {
                    toast.error(error.message || "Failed to load messages");
                }
            } finally {
                setIsLoading(false);
            }
        };

        // Fetch pending update requests
        const fetchPendingRequests = async () => {
            try {
                const response = await chatService.getVendorUpdateRequests("pending");
                if (response.success) {
                    setPendingRequests(response.requests);
                }
            } catch (error) {
                console.error("Failed to fetch pending requests:", error);
            }
        };

        fetchMessages();
        if (user?.role === "vendor") {
            fetchPendingRequests();
        }

        // Poll for new messages every 30 seconds
        const interval = setInterval(fetchMessages, 30000);
        return () => clearInterval(interval);
    }, [activeVendorId, user?.role]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim() && attachments.length === 0) return;
        if (!activeVendorId) {
            toast.error("Could not determine vendor ID");
            return;
        }

        setIsSending(true);

        try {
            // Upload attachments first if any (would need separate upload endpoint)
            const uploadedAttachments = attachments.map(file => ({
                name: file.name,
                url: URL.createObjectURL(file), // Temporary - would be replaced with actual upload
                type: file.type.startsWith("image/") ? "image" as const : "file" as const
            }));

            const response = await chatService.sendMessage(
                activeVendorId,
                inputMessage,
                uploadedAttachments.length > 0 ? uploadedAttachments : undefined
            );

            if (response.success) {
                setMessages(prev => [...prev, response.message]);
                setInputMessage("");
                setAttachments([]);
                toast.success("Message sent");
            }
        } catch (error: any) {
            console.error("Failed to send message:", error);
            toast.error(error.message || "Failed to send message");
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

    const getMessageStatusIcon = (message: ChatMessage) => {
        if (message.sender !== "vendor") return null;

        if (message.read_at) {
            return <CheckCheck className="h-3 w-3 text-green-500" />;
        }
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
    };

    const getMessageTypeIcon = (message: ChatMessage) => {
        if (message.message_type === "update_request") {
            return <Clock className="h-4 w-4 text-yellow-500" />;
        }
        if (message.message_type === "system") {
            if (message.message.includes("approved")) {
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            }
            if (message.message.includes("rejected")) {
                return <XCircle className="h-4 w-4 text-red-500" />;
            }
        }
        return null;
    };

    if (!activeVendorId && !isLoading) {
        return (
            <div className="h-[calc(100vh-12rem)] flex items-center justify-center">
                <Card className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Unable to load chat. Please try again later.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-12rem)] flex flex-col">
            <Card className="flex-1 flex flex-col">
                {/* Header */}
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    AS
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg">Admin Support</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Chat with admin for profile updates & support
                                </CardDescription>
                            </div>
                        </div>
                        {pendingRequests.length > 0 && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                {pendingRequests.length} Pending {pendingRequests.length === 1 ? 'Request' : 'Requests'}
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
                        {isLoading ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                                <p>No messages yet.</p>
                                <p className="text-sm">Start a conversation with admin support!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${message.sender === "vendor" ? "flex-row-reverse" : "flex-row"
                                            }`}
                                    >
                                        <Avatar className="h-10 w-10 flex-shrink-0">
                                            <AvatarFallback className={message.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-secondary"}>
                                                {message.sender === "admin" ? "AS" : "ME"}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className={`flex flex-col max-w-[70%] ${message.sender === "vendor" ? "items-end" : "items-start"
                                            }`}>
                                            {/* Message type indicator */}
                                            {message.message_type !== "text" && (
                                                <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                                                    {getMessageTypeIcon(message)}
                                                    <span>
                                                        {message.message_type === "update_request" && "Update Request"}
                                                        {message.message_type === "system" && "System Notification"}
                                                    </span>
                                                </div>
                                            )}

                                            {message.message && (
                                                <div
                                                    className={`rounded-lg p-4 ${message.sender === "vendor"
                                                        ? "bg-primary text-primary-foreground"
                                                        : message.message_type === "system"
                                                            ? "bg-muted border border-border"
                                                            : "bg-muted"
                                                        }`}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                                </div>
                                            )}

                                            {/* Attachments */}
                                            {message.attachments && message.attachments.length > 0 && (
                                                <div className="mt-2 space-y-2 w-full">
                                                    {message.attachments.map((attachment, idx) => (
                                                        <div key={idx}>
                                                            {attachment.type === "image" ? (
                                                                <div className="rounded-lg overflow-hidden border max-w-xs">
                                                                    <img
                                                                        src={attachment.url}
                                                                        alt={attachment.name}
                                                                        className="w-full h-auto"
                                                                    />
                                                                    <div className="p-2 bg-muted text-xs flex items-center justify-between">
                                                                        <span className="truncate">{attachment.name}</span>
                                                                        <Button size="icon" variant="ghost" className="h-6 w-6" asChild>
                                                                            <a href={attachment.url} download={attachment.name}>
                                                                                <Download className="h-3 w-3" />
                                                                            </a>
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-card max-w-xs">
                                                                    <File className="h-8 w-8 text-muted-foreground" />
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium truncate">{attachment.name}</p>
                                                                    </div>
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                                                                        <a href={attachment.url} download={attachment.name}>
                                                                            <Download className="h-4 w-4" />
                                                                        </a>
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${message.sender === "vendor" ? "flex-row-reverse" : "flex-row"
                                                }`}>
                                                <span>{new Date(message.created_at).toLocaleString()}</span>
                                                {getMessageStatusIcon(message)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>

                {/* Input Area */}
                <div className="border-t p-4">
                    {/* Attachment Preview */}
                    {attachments.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                            {attachments.map((file, index) => (
                                <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm">
                                    {file.type.startsWith("image/") ? (
                                        <ImageIcon className="h-4 w-4" />
                                    ) : (
                                        <File className="h-4 w-4" />
                                    )}
                                    <span className="max-w-[150px] truncate">{file.name}</span>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-5 w-5"
                                        onClick={() => removeAttachment(index)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2">
                        {/* Hidden file inputs */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            multiple
                            onChange={handleFileSelect}
                        />
                        <input
                            ref={imageInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                        />

                        {/* Attachment buttons */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => imageInputRef.current?.click()}
                            title="Attach image"
                            disabled={isSending}
                        >
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            title="Attach file"
                            disabled={isSending}
                        >
                            <Paperclip className="h-4 w-4" />
                        </Button>

                        {/* Message input */}
                        <Textarea
                            placeholder="Type your message..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            className="flex-1 min-h-[44px] max-h-32 resize-none"
                            rows={1}
                            disabled={isSending}
                        />

                        {/* Send button */}
                        <Button
                            onClick={handleSendMessage}
                            size="icon"
                            className="h-11 w-11"
                            disabled={isSending || (!inputMessage.trim() && attachments.length === 0)}
                        >
                            {isSending ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Press Enter to send, Shift + Enter for new line
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default SupportChatTab;
