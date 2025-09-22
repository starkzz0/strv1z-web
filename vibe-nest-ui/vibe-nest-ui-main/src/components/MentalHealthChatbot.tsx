import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic, Bot, User } from "lucide-react";

// Sample responses for mental health support
const MENTAL_HEALTH_RESPONSES = {
  greeting: [
    "नमस्ते! मैं आपका AI मानसिक स्वास्थ्य सहायक हूँ। आज आप कैसा महसूस कर रहे हैं?",
    "Hello! I'm your AI mental health assistant. How are you feeling today?",
    "Hi there! I'm here to support your mental wellbeing. What's on your mind?"
  ],
  anxiety: [
    "It sounds like you might be experiencing anxiety. Try taking a few deep breaths with me. Breathe in for 4 counts, hold for 4, and exhale for 6.",
    "Anxiety can be challenging. Remember that your feelings are valid, and there are techniques that can help. Would you like to try a grounding exercise?",
    "I hear that you're feeling anxious. Sometimes focusing on the present moment can help. Can you name 5 things you can see right now?"
  ],
  depression: [
    "I'm sorry you're feeling down. Depression can make everything feel more difficult. Have you been able to do any small self-care activities today?",
    "It takes courage to talk about feeling depressed. Remember that you don't have to face these feelings alone. Would it help to discuss some coping strategies?",
    "When we're feeling depressed, even small steps matter. Could you try doing one tiny pleasant activity today, like enjoying a favorite drink or stepping outside for fresh air?"
  ],
  stress: [
    "Stress can be overwhelming. Let's take a moment to identify what's within your control right now and what isn't.",
    "Managing stress often starts with taking care of your basic needs. Have you been able to eat, sleep, and move your body today?",
    "When stress builds up, sometimes a brief mental break can help. Would you like to try a quick 2-minute mindfulness exercise with me?"
  ],
  general: [
    "I'm here to support you. Would you like to talk more about what you're experiencing?",
    "Thank you for sharing that with me. How long have you been feeling this way?",
    "Your mental health matters. What's one small thing you could do today that might help you feel a bit better?"
  ]
};

// Function to get appropriate response based on message content
const getAIResponse = (message: string) => {
  const lowerMessage = message.toLowerCase();
  
  // Check for keywords to determine response category
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey") || lowerMessage.includes("नमस्ते")) {
    return MENTAL_HEALTH_RESPONSES.greeting[Math.floor(Math.random() * MENTAL_HEALTH_RESPONSES.greeting.length)];
  } else if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("worried") || lowerMessage.includes("panic") || lowerMessage.includes("घबराहट")) {
    return MENTAL_HEALTH_RESPONSES.anxiety[Math.floor(Math.random() * MENTAL_HEALTH_RESPONSES.anxiety.length)];
  } else if (lowerMessage.includes("sad") || lowerMessage.includes("depress") || lowerMessage.includes("unhappy") || lowerMessage.includes("miserable") || lowerMessage.includes("उदास")) {
    return MENTAL_HEALTH_RESPONSES.depression[Math.floor(Math.random() * MENTAL_HEALTH_RESPONSES.depression.length)];
  } else if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelm") || lowerMessage.includes("pressure") || lowerMessage.includes("तनाव")) {
    return MENTAL_HEALTH_RESPONSES.stress[Math.floor(Math.random() * MENTAL_HEALTH_RESPONSES.stress.length)];
  } else {
    return MENTAL_HEALTH_RESPONSES.general[Math.floor(Math.random() * MENTAL_HEALTH_RESPONSES.general.length)];
  }
};

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export default function MentalHealthChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "नमस्ते! मैं आपका AI मानसिक स्वास्थ्य सहायक हूँ। आज आप कैसा महसूस कर रहे हैं?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(userMessage.content),
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-md mx-auto overflow-hidden p-0">
      <div className="bg-primary p-4 text-primary-foreground flex items-center">
        <Bot className="h-6 w-6 mr-2" />
        <h2 className="text-lg font-semibold">Mental Health Assistant</h2>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar className={`h-8 w-8 ${message.sender === "user" ? "ml-2" : "mr-2"}`}>
                  {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </Avatar>
                <div 
                  className={`rounded-lg px-4 py-2 ${
                    message.sender === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start max-w-[80%]">
                <Avatar className="h-8 w-8 mr-2">
                  <Bot className="h-4 w-4" />
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <p>Typing<span className="animate-pulse">...</span></p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <form 
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={inputValue.trim() === "" || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
          <Button type="button" size="icon" variant="outline">
            <Mic className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}