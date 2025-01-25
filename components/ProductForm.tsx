'use client';

import { useToast } from '@/hooks/use-toast';
import { productDefaultValues } from '@/lib/constants';
import { insertProductSchema, updateProductSchema } from '@/lib/schemas';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import slugify from 'slugify';
import { Textarea } from './ui/textarea';
import { formatError } from '@/lib/utils';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent } from './ui/card';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

type Props = {
  type: 'Create' | 'Update';
  product?: Product | null;
  productId?: string;
};

const ProductForm = ({ type, product, productId }: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === 'Create'
        ? zodResolver(insertProductSchema)
        : zodResolver(updateProductSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  });

  const handleFormSubmit = async (
    data: z.infer<typeof insertProductSchema>
  ) => {
    try {
      //Create Product
      if (type === 'Create') {
        const res = await createProduct(data);

        if (!res.success) {
          toast({
            variant: 'destructive',
            title: 'Error Creating Product',
            description: res.message,
          });
        } else {
          toast({
            variant: 'default',
            title: 'Product Created',
            description: res.message,
          });
        }
        router.push('/admin/products');
      } else {
        //Update Product
        if (!productId) {
          router.push('/admin/products');
        }
        const res = await updateProduct({ ...data, id: productId as string });

        if (!res.success) {
          toast({
            variant: 'destructive',
            title: 'Error Editing Product',
            description: res.message,
          });
        } else {
          toast({
            variant: 'default',
            title: 'Product Updated',
            description: res.message,
          });
        }
      }
      router.push('/admin/products');
    } catch (error) {
      return {
        success: false,
        message: formatError(error),
      };
    }
  };
  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');
  return (
    <Form {...form}>
      <form
        method="POST"
        className="space-y-8"
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        <div className="flex flex-col md:flex-row justify-between gap-4 ">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/**Slug */}
          <div className="w-full">
            <FormField
              name="slug"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter Slug" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              className="mt-2"
              onClick={() => {
                form.setValue(
                  'slug',
                  slugify(form.watch('name'), { lower: true })
                );
              }}
            >
              Generate Slug
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Categoty */}
          <FormField
            name="category"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Product Category" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/**Brand */}
          <FormField
            name="brand"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter product brand" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Price */}
          <FormField
            name="price"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter product price" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/**Stock */}
          <FormField
            name="stock"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter product stock" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field flex flex-col gap-5 md:flex-row">
          {/* Images */}
          <FormField
            name="images"
            control={form.control}
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.map((image, index) => (
                        <Image
                          src={image}
                          alt="product image"
                          className="w-20 h-20 object-cover object-center rounded-md"
                          width={100}
                          height={100}
                          key={index}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint={'imageUploader'}
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [...images, res[0].url]);
                          }}
                          onUploadError={(err: Error) => {
                            toast({
                              variant: 'destructive',
                              title: 'Error Uploading Image',
                              description: err.message,
                            });
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">
          {/* isFeatured */}
          Featured Product
          <Card>
            <CardContent className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Featured?</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt="Banner Image"
                  width={1920}
                  height={680}
                  className="w-full object-cover object-center rounded-sm"
                />
              )}
              {isFeatured && !banner && (
                <UploadButton
                  endpoint={'imageUploader'}
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue('banner', res[0].url);
                  }}
                  onUploadError={(err: Error) => {
                    toast({
                      variant: 'destructive',
                      title: 'Error Uploading Image',
                      description: err.message,
                    });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          {/**Description */}
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Discription</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter product discription"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            className="w-full button col-span-2"
            type="submit"
            disabled={form.formState.isSubmitting}
            size={'lg'}
          >
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
