import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const RentPurchase = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, { message: t('rentPurchase.form.required') }),
    city: z.string().min(1, { message: t('rentPurchase.form.required') }),
    country: z.string().min(1, { message: t('rentPurchase.form.required') }),
    phone: z.string().min(1, { message: t('rentPurchase.form.required') }),
    email: z.string().email().min(1, { message: t('rentPurchase.form.required') }),
    howKnowUs: z.string().optional(),
    enterpriseOrPrivate: z.enum(["enterprise", "private"]),
    publicOrPrivate: z.enum(["public", "private"]),
    rentOrBuy: z.enum(["rent", "buy"]),
    comment: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      city: "",
      country: "",
      phone: "",
      email: "",
      howKnowUs: "",
      enterpriseOrPrivate: "private",
      publicOrPrivate: "private",
      rentOrBuy: "rent",
      comment: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('https://formspree.io/f/xgvrveqe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      toast({
        title: "Thank you! We'll contact you soon.",
        description: t('rentPurchase.form.success'),
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Something went wrong. Please try again later.",
        description: t('rentPurchase.form.error'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold font-rajdhani mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('rentPurchase.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('rentPurchase.subtitle')}
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-lg border border-border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">{t('rentPurchase.form.name')} *</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">{t('rentPurchase.form.city')} *</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">{t('rentPurchase.form.country')} *</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">{t('rentPurchase.form.phone')} *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t('rentPurchase.form.phonePlaceholder')} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">{t('rentPurchase.form.email')} *</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder={t('rentPurchase.form.emailPlaceholder')} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="howKnowUs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">{t('rentPurchase.form.howKnowUs')}</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enterpriseOrPrivate"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-foreground">{t('rentPurchase.form.enterpriseOrPrivate')} *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="enterprise" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t('rentPurchase.form.enterprise')}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="private" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t('rentPurchase.form.private')}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publicOrPrivate"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-foreground">{t('rentPurchase.form.publicOrPrivate')} *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="public" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t('rentPurchase.form.public')}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="private" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t('rentPurchase.form.private')}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rentOrBuy"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-foreground">{t('rentPurchase.form.rentOrBuy')} *</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="rent" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t('rentPurchase.form.rent')}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="buy" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t('rentPurchase.form.buy')}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">{t('rentPurchase.form.comment')}</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="bg-background min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('rentPurchase.form.sending') : t('rentPurchase.form.send')}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default RentPurchase;
