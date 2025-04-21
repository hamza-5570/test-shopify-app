import { Page, Layout, Text, Card, Button } from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { Redirect } from "@shopify/app-bridge/actions";
import { createApp} from "@shopify/app-bridge";
import { useAppBridge } from "@shopify/app-bridge-react";
import {useLoaderData} from "@remix-run/react"
export const loader = async ({ request }) => {
 const {admin}= await authenticate.admin(request);
 const response=await admin.graphql(`
    query {
      shop {
        name
        myshopifyDomain
        url
        email
      }
    }
  `);

 const shop =  await response.json();
  return shop.data.shop;
};

export default function Index() {
  const shop=useLoaderData();
  const app = createApp({
    apiKey: "44c605e398e252fbc7fdd0cc5a74d230",
    host: new URLSearchParams(typeof window !== "undefined" && window.location.search).get("host"),
  });
  const handleRedirect =async () => {
    const redirect = Redirect.create(app);    
    redirect.dispatch(
      Redirect.Action.REMOTE,
      `https://wonport.vercel.app/firstAuthFromShopify?shop=${shop.myshopifyDomain}&email=${shop?.email}&appUrl=${shop.url}`
    );
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingLg" as="h2" alignment="center">
              Connect to Wonport App
            </Text>
            <center style={{
              marginTop:"10px"
            }}>
            <Button  onClick={handleRedirect}>Connect</Button>
            </center>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}