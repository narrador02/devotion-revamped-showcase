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
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Truck, Headphones } from "lucide-react";
import { Helmet } from "react-helmet-async";
import SEO from "@/components/SEO";

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
        title: t('rentPurchase.form.success'),
        description: t('contactPage.form.sentDesc'),
      });
      form.reset();
    } catch (error) {
      toast({
        title: t('rentPurchase.form.error'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: t('rentPurchase.benefits.quality'),
      description: t('rentPurchase.benefits.qualityDesc')
    },
    {
      icon: <Truck className="w-6 h-6 text-primary" />,
      title: t('rentPurchase.benefits.shipping'),
      description: t('rentPurchase.benefits.shippingDesc')
    },
    {
      icon: <Headphones className="w-6 h-6 text-primary" />,
      title: t('rentPurchase.benefits.support'),
      description: t('rentPurchase.benefits.supportDesc')
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
      title: t('rentPurchase.benefits.warranty'),
      description: t('rentPurchase.benefits.warrantyDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-background font-inter">
      <SEO
        title={t('seo.rentPurchase.title')}
        description={t('seo.rentPurchase.description')}
        keywords={t('seo.rentPurchase.keywords')}
        path="/rent-purchase"
      />
      <Helmet>
        <title>{t('rentPurchase.title')} | DevotionSim</title>
        <meta name="description" content={t('rentPurchase.subtitle')} />
      </Helmet>
      <Navigation />

      <div className="flex flex-col lg:flex-row min-h-screen pt-20">
        {/* Left Side - Visuals & Info */}
        <div className="lg:w-5/12 bg-muted/30 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-lg mx-auto lg:mx-0"
          >
            <h1 className="text-4xl lg:text-5xl font-rajdhani font-bold mb-6 text-foreground">
              {t('rentPurchase.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              {t('rentPurchase.subtitle')}
            </p>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-3 rounded-xl bg-background border border-border shadow-sm shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-7/12 p-8 lg:p-12 bg-background flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto w-full"
          >
            <div className="bg-card p-8 rounded-2xl border border-border shadow-lg">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('rentPurchase.form.name')} *</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-11" />
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
                          <FormLabel>{t('rentPurchase.form.email')} *</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder={t('rentPurchase.form.emailPlaceholder')} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('rentPurchase.form.phone')} *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={t('rentPurchase.form.phonePlaceholder')} className="h-11" />
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
                          <FormLabel>{t('rentPurchase.form.city')} *</FormLabel>
                          <FormControl>
                            <Input {...field} className="h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('rentPurchase.form.country')} *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/30 rounded-xl border border-border/50">
                    <FormField
                      control={form.control}
                      name="rentOrBuy"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-semibold">{t('rentPurchase.form.rentOrBuy')} *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="rent" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer hover:text-primary transition-colors">
                                  {t('rentPurchase.form.rent')}
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="buy" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer hover:text-primary transition-colors">
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
                      name="enterpriseOrPrivate"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="font-semibold">{t('rentPurchase.form.enterpriseOrPrivate')} *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-4"
                            >
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="enterprise" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer hover:text-primary transition-colors">
                                  {t('rentPurchase.form.enterprise')}
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="private" />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer hover:text-primary transition-colors">
                                  {t('rentPurchase.form.private')}
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('rentPurchase.form.comment')}</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="min-h-[120px] resize-none" placeholder={t('rentPurchase.form.commentPlaceholder')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('rentPurchase.form.sending') : t('rentPurchase.form.send')}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
      <LanguageSwitcher />
    </div>
  );
};

export default RentPurchase;
