import MentalHealthChatbot from "@/components/MentalHealthChatbot";
import { Card } from "@/components/ui/card";

export default function MentalHealthChat() {
  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Mental Health Support</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MentalHealthChatbot />
        </div>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">About AI Assistant</h3>
            <p className="text-muted-foreground mb-4">
              Our AI mental health assistant is trained to provide supportive conversations and coping strategies for common mental health concerns.
            </p>
            <p className="text-muted-foreground">
              While this AI can offer support, it is not a replacement for professional mental health care. If you're experiencing a crisis, please contact emergency services.
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-primary hover:underline">Mental Health Helpline: 1800-599-0019</a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">Meditation Exercises</a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">Stress Management Techniques</a>
              </li>
              <li>
                <a href="#" className="text-primary hover:underline">Find a Therapist</a>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}