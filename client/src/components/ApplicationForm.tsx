import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertApplicationSchema, type Role } from "@shared/schema";
import { z } from "zod";
import { useCreateApplication } from "@/hooks/use-applications";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ApplicationFormProps {
  role: Role;
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = insertApplicationSchema.extend({
  roleId: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>;

export function ApplicationForm({ role, isOpen, onClose }: ApplicationFormProps) {
  const { mutate: submitApplication, isPending } = useCreateApplication();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleId: role.id,
      name: "",
      email: "",
      message: "",
      portfolioUrl: "",
    }
  });

  const onSubmit = (data: FormValues) => {
    submitApplication(data, {
      onSuccess: () => {
        reset();
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-card border-border rounded-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Apply for {role.title}</DialogTitle>
          <DialogDescription className="font-body text-muted-foreground">
            Tell us why you belong on this journey. Be honest. Be bold.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <input type="hidden" {...register("roleId")} value={role.id} />

          <div className="space-y-2">
            <Label htmlFor="name" className="uppercase text-xs tracking-widest">Full Name</Label>
            <Input 
              id="name" 
              {...register("name")} 
              className="rounded-none border-x-0 border-t-0 border-b-2 border-border focus-visible:ring-0 focus-visible:border-primary px-0 bg-transparent text-lg"
              placeholder="Amjad Masad"
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="uppercase text-xs tracking-widest">Email Address</Label>
            <Input 
              id="email" 
              type="email"
              {...register("email")} 
              className="rounded-none border-x-0 border-t-0 border-b-2 border-border focus-visible:ring-0 focus-visible:border-primary px-0 bg-transparent text-lg"
              placeholder="you@vision.com"
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio" className="uppercase text-xs tracking-widest">Portfolio / LinkedIn (Optional)</Label>
            <Input 
              id="portfolio" 
              {...register("portfolioUrl")} 
              className="rounded-none border-x-0 border-t-0 border-b-2 border-border focus-visible:ring-0 focus-visible:border-primary px-0 bg-transparent text-lg"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="uppercase text-xs tracking-widest">Why You?</Label>
            <Textarea 
              id="message" 
              {...register("message")} 
              className="rounded-none border-2 border-border focus-visible:ring-0 focus-visible:border-primary bg-transparent min-h-[150px] resize-none p-4 font-serif-italic text-lg"
              placeholder="Tell us your story..."
            />
            {errors.message && <p className="text-destructive text-sm">{errors.message.message}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isPending}
              className="rounded-none uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 uppercase tracking-widest min-w-[140px]"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
