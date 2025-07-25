// components/forms/create-author-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createAuthor } from "@/actions/author-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authorSchema, AuthorSchema } from "@/lib/validation";

export function CreateAuthorForm({
  users,
}: {
  users: { id: string; email: string }[];
}) {
  const form = useForm<AuthorSchema>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      name: "",
      bio: "",
      userId: "",
    },
  });

  const { handleSubmit, control, reset } = form;

  const onSubmit = async (data: AuthorSchema) => {
    const result = await createAuthor(data);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Author created!");
      reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-xl space-y-6"
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Short author biography..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Linked User</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Select a user --" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Author</Button>
      </form>
    </Form>
  );
}
