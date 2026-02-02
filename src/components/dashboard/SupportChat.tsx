import { useState, useRef } from "react";
import { Send, Paperclip, Image as ImageIcon, X, Download, File, User, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Message {
    id: string;
    sender: "vendor" | "admin";
    text: string;
    timestamp: string;
    attachments?: {
        name: string;
        url: string;
        type: "image" | "file";
        size?: string;
    }[];
    status?: "sent" | "delivered" | "read";
}

const SupportChatTab = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            sender: "admin",
            text: "Hello! Welcome to LankaPass Support. How can we assist you today?",
            timestamp: new Date(Date.now() - 3600000).toLocaleString(),
            status: "read"
        },
        {
            id: "2",
            sender: "admin",
            text: "You can send us messages, attach files, or share images. We're here to help!",
            timestamp: new Date(Date.now() - 3500000).toLocaleString(),
            status: "read"
        }
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = () => {
        if (!inputMessage.trim() && attachments.length === 0) return;

        const messageAttachments = attachments.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type.startsWith("image/") ? "image" as const : "file" as const,
            size: (file.size / 1024).toFixed(2) + " KB"
        }));

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: "vendor",
            text: inputMessage,
            timestamp: new Date().toLocaleString(),
            attachments: messageAttachments.length > 0 ? messageAttachments : undefined,
            status: "sent"
        };

        setMessages([...messages, newMessage]);
        setInputMessage("");
        setAttachments([]);

        // Simulate message status updates
        setTimeout(() => {
            setMessages(prev => prev.map(msg =>
                msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
            ));
        }, 1000);

        // Simulate admin response
        setTimeout(() => {
            const adminResponse: Message = {
                id: (Date.now() + 1).toString(),
                sender: "admin",
                text: "Thank you for your message. Our team is reviewing your request and will respond shortly.",
                timestamp: new Date().toLocaleString(),
                status: "read"
            };
            setMessages(prev => [...prev, adminResponse]);
        }, 2000);
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
                                    Online - Usually replies within minutes
                                </CardDescription>
                            </div>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                    </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
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
                                        {message.text && (
                                            <div
                                                className={`rounded-lg p-4 ${message.sender === "vendor"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                    }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
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
                                                                    <p className="text-xs text-muted-foreground">{attachment.size}</p>
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
                                            <span>{message.timestamp}</span>
                                            {message.sender === "vendor" && message.status && (
                                                <div className="flex items-center">
                                                    {message.status === "sent" && <CheckCheck className="h-3 w-3" />}
                                                    {message.status === "delivered" && <CheckCheck className="h-3 w-3 text-blue-500" />}
                                                    {message.status === "read" && <CheckCheck className="h-3 w-3 text-green-500" />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                        >
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            title="Attach file"
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
                        />

                        {/* Send button */}
                        <Button onClick={handleSendMessage} size="icon" className="h-11 w-11">
                            <Send className="h-4 w-4" />
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
