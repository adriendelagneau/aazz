"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

import { createArticle } from "@/actions/article-actions";
import { CloudinaryUploadButton } from "@/components/cloudinary-upload-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { articleSchema, ArticleSchema } from "@/lib/validation";

export function CreateArticleForm({
  categories,
  tags,
}: {
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}) {
  const form = useForm<ArticleSchema>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      categoryId: "",
      tagIds: [],
      parts: [
        {
          title: "",
          order: 0,
          paragraphs: [{ content: "", order: 0 }],
        },
      ],
      asset: {
        type: "IMAGE",
        url: "",
        legend: "",
        altText: "",
      },
      isBreaking: false, // ✅ add this
    },
  });

  const { control, handleSubmit, reset, watch, setValue } = form;

  // Watch the asset URL field for changes
  const assetUrl = watch("asset.url");

  const handleUpload = (url: string) => {
    setValue("asset.url", url);
  };

  const {
    fields: partFields,
    append: appendPart,
    remove: removePart,
  } = useFieldArray({
    control,
    name: "parts",
  });
  const onSubmit = async (data: ArticleSchema) => {
    const result = await createArticle(data);

    if ("error" in result) {
      toast.error(result.error);
    } else {
      toast.success("Article created!");
      reset();
    }
  };
  const onError = () => toast.error("Please fix the validation errors.");

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="mx-auto max-w-4xl space-y-6"
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

        {/* Excerpt */}
        <FormField
          control={control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover Image URL */}
        <div className="space-y-4">
          <FormField
            control={control}
            name="asset.url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <div className="flex items-center gap-4">
                  <Input {...field} />
                  <CloudinaryUploadButton onUpload={handleUpload} />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {assetUrl && (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative mt-4 h-40 w-64 overflow-hidden rounded border border-gray-300">
                <Image
                  src={assetUrl}
                  alt="Uploaded cover image"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>

              {/* Alt Text */}
              <FormField
                control={control}
                name="asset.altText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Alt Text</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Short alt description for accessibility"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Legend */}
              <FormField
                control={control}
                name="asset.legend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Legend</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Image caption or credit" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Category Select */}
        <FormField
          control={control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={control}
          name="tagIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const selected = field.value?.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          const next = new Set(field.value || []);
                          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                          selected ? next.delete(tag.id) : next.add(tag.id);
                          field.onChange(Array.from(next));
                        }}
                        className={`rounded-full border px-3 py-1 text-sm ${
                          selected
                            ? "bg-primary border-primary text-white"
                            : "bg-muted text-muted-foreground border"
                        }`}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Article Parts */}
        <div className="space-y-6">
          {partFields.map((part, index) => (
            <div
              key={part.id}
              className="bg-muted/50 space-y-4 rounded border p-4"
            >
              {/* Section Title */}
              <FormField
                control={control}
                name={`parts.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Optional" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Paragraphs */}
              <FormLabel>Paragraphs</FormLabel>
              {watch(`parts.${index}.paragraphs`)?.map((_, pIdx) => (
                <div key={pIdx} className="flex items-start gap-2">
                  <FormField
                    control={control}
                    name={`parts.${index}.paragraphs.${pIdx}.content`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Write a paragraph..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const current = watch(`parts.${index}.paragraphs`) || [];
                      setValue(
                        `parts.${index}.paragraphs`,
                        current.filter((_, i) => i !== pIdx)
                      );
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => {
                  const paragraphs = watch(`parts.${index}.paragraphs`) || [];
                  setValue(`parts.${index}.paragraphs`, [
                    ...paragraphs,
                    { content: "", order: paragraphs.length },
                  ]);
                }}
              >
                Add Paragraph
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={() => removePart(index)}
              >
                Remove Section
              </Button>
            </div>
          ))}

          <Button
            type="button"
            onClick={() =>
              appendPart({
                title: "",
                order: partFields.length,
                paragraphs: [{ content: "", order: 0 }],
              })
            }
          >
            Add Section
          </Button>
        </div>
        <FormField
          control={control}
          name="isBreaking"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-medium">
                Mark as Breaking News
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit */}
        <Button type="submit">Create Article</Button>
      </form>
    </Form>
  );
}
