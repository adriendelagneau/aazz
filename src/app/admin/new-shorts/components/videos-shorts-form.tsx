"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";

import { createVideoShort } from "@/actions/videos-actions";
import { CloudinaryUploadButton } from "@/components/cloudinary-upload-button";
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
import { Textarea } from "@/components/ui/textarea";
import {  VideoShortInput, videoShortSchema } from "@/lib/validation";

export default function VideoShortForm() {
const form = useForm<VideoShortInput>({
  resolver: zodResolver(videoShortSchema),
  defaultValues: {
    title: "",
    description: "",
    duration: 0,
    asset: {
      type: "VIDEO",
      url: "",
      legend: "",
      altText: "",
    },
  },
});

  const { control, handleSubmit, reset, watch, setValue, formState } = form;

  const [isPending, startTransition] = useTransition();

  // Watch asset url for showing preview and alt/legend inputs conditionally
  const assetUrl = watch("asset.url");

  // Handle video upload and set the URL & type in form
  const handleVideoUpload = (url: string) => {
    setValue("asset.url", url, { shouldValidate: true });
    setValue("asset.type", "VIDEO", { shouldValidate: true });
  };

  const onSubmit = (data: VideoShortInput) => {
    startTransition(async () => {
      try {
        await createVideoShort(data);
        reset();
      } catch (error) {
        console.error("Failed to create video short", error);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-md space-y-6"
      >
        {/* Title */}
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Duration */}
        <FormField
          control={control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (seconds, optional)</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Video Asset Upload */}
        <FormField
          control={control}
          name="asset.url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Video Asset</FormLabel>
              <div className="flex items-center gap-4">
                <Input {...field} placeholder="Video asset URL" readOnly />
                <CloudinaryUploadButton onUpload={handleVideoUpload} />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Video preview */}
        {assetUrl && (
          <div className="mt-4">
            <video
              controls
              src={assetUrl}
              className="max-h-40 rounded border"
            />
          </div>
        )}

        {/* Show legend & altText only if asset URL exists */}
        {assetUrl && (
          <>
            <FormField
              control={control}
              name="asset.legend"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Legend (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="asset.altText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Alt Text (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" disabled={isPending || formState.isSubmitting}>
          {isPending || formState.isSubmitting ? "Creating…" : "Create Short"}
        </Button>
      </form>
    </Form>
  );
}
