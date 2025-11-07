import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarCheck } from "lucide-react";

const Events = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold font-rajdhani mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('events.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('events.subtitle')}
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
                <TabsTrigger value="upcoming" className="text-base">
                  {t('events.tabs.upcoming')}
                </TabsTrigger>
                <TabsTrigger value="past" className="text-base">
                  {t('events.tabs.past')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-8">
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-6 w-6 text-primary" />
                      <CardTitle className="text-2xl">{t('events.upcoming.title')}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {t('events.upcoming.subtitle')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                      Coming soon...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="past" className="space-y-8">
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <CalendarCheck className="h-6 w-6 text-primary" />
                      <CardTitle className="text-2xl">{t('events.past.title')}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {t('events.past.subtitle')}
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

export default Events;
