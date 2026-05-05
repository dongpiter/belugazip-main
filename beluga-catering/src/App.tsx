import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import NotFound from "@/pages/not-found";

import Home from "@/pages/public/home";
import Menus from "@/pages/public/menus";
import MenuDetail from "@/pages/public/menu-detail";
import Blog from "@/pages/public/blog";
import BlogPost from "@/pages/public/blog-post";
import About from "@/pages/public/about";
import Contact from "@/pages/public/contact";
import LandingOffice from "@/pages/public/landing-office";
import LandingCorporate from "@/pages/public/landing-corporate";
import LandingIndustrial from "@/pages/public/landing-industrial";
import LandingEventCooking from "@/pages/public/landing-event-cooking";
import LandingTPHCM from "@/pages/public/landing-tphcm";
import LandingBinhDuong from "@/pages/public/landing-binh-duong";
import DistrictPage from "@/pages/public/district";

import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOrders from "@/pages/admin/orders";
import AdminLeads from "@/pages/admin/leads";
import AdminCustomers from "@/pages/admin/customers";
import AdminMenus from "@/pages/admin/menus";
import AdminMenuForm from "@/pages/admin/menu-form";
import AdminBlog from "@/pages/admin/blog";
import AdminBlogForm from "@/pages/admin/blog-form";
import AdminKanban from "@/pages/admin/realtime-orders";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminSettings from "@/pages/admin/settings";

import ExitIntentPopup from "@/components/ExitIntentPopup";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppZalo from "@/components/WhatsAppZalo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const DISTRICT_SLUGS = [
  "com-van-phong-quan-1",
  "com-van-phong-quan-3",
  "com-van-phong-binh-thanh",
  "com-van-phong-go-vap",
  "com-van-phong-thu-duc",
  "com-van-phong-tan-binh",
  "com-van-phong-binh-duong",
  "com-van-phong-dong-nai",
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <ScrollToTop />
        <ExitIntentPopup />
        <WhatsAppZalo />
        <Switch>
          {/* Public */}
          <Route path="/" component={Home} />
          <Route path="/menus" component={Menus} />
          <Route path="/menus/:slug" component={MenuDetail} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />

          {/* Service landing pages */}
          <Route path="/com-van-phong" component={LandingOffice} />
          <Route path="/com-van-phong-tphcm" component={LandingTPHCM} />
          <Route path="/com-van-phong-binh-duong" component={LandingBinhDuong} />
          <Route path="/dat-tiec-cong-ty" component={LandingCorporate} />
          <Route path="/suat-an-cong-nghiep" component={LandingIndustrial} />
          <Route path="/dich-vu-nau-an-su-kien" component={LandingEventCooking} />

          {/* Programmatic local SEO pages */}
          {DISTRICT_SLUGS.map((slug) => (
            <Route key={slug} path={`/${slug}`}>
              {() => <DistrictPage districtSlug={slug} />}
            </Route>
          ))}

          {/* Admin */}
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/orders" component={AdminOrders} />
          <Route path="/admin/realtime-orders" component={AdminKanban} />
          <Route path="/admin/leads" component={AdminLeads} />
          <Route path="/admin/customers" component={AdminCustomers} />
          <Route path="/admin/menus" component={AdminMenus} />
          <Route path="/admin/menus/new" component={AdminMenuForm} />
          <Route path="/admin/menus/:id/edit" component={AdminMenuForm} />
          <Route path="/admin/blog" component={AdminBlog} />
          <Route path="/admin/blog/new" component={AdminBlogForm} />
          <Route path="/admin/blog/:id/edit" component={AdminBlogForm} />
          <Route path="/admin/analytics" component={AdminAnalytics} />
          <Route path="/admin/settings" component={AdminSettings} />

          <Route component={NotFound} />
        </Switch>
      </WouterRouter>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
