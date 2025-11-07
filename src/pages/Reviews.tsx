import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users } from "lucide-react";

const Reviews = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold font-rajdhani mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('reviews.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('reviews.subtitle')}
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="professionals" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
                <TabsTrigger value="professionals" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  {t('reviews.tabs.professionals')}
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('reviews.tabs.customers')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="professionals" className="space-y-8">
                <Card className="border-primary/20 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-rajdhani text-3xl">
                      <Trophy className="h-6 w-6 text-primary" />
                      {t('reviews.professionals.title')}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {t('reviews.professionals.subtitle')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                      Coming soon...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customers" className="space-y-8">
                <Card className="border-primary/20 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-rajdhani text-3xl">
                      <Users className="h-6 w-6 text-primary" />
                      {t('reviews.customers.title')}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {t('reviews.customers.subtitle')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                      Coming soon...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default Reviews;
