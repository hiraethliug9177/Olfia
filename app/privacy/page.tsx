import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

/**
 * Privacy (Tiffany's copy v1, 11/24, §11). Checked against the code on 11/24: entries, Fragrance Shelf (photos are shrunk
 * and kept in the browser), preferences, quiz result and small settings are all in this browser under "olfia." keys;
 * GA4 events carry ids and categories, never typed text, and no typed text goes in a page address; EEA/UK/CH and
 * GPC/DNT start cookieless; ads are off; Kit receives only the email; the found-us answer is a fixed menu sent to GA4.
 * Two sentences in "Your saved entries" are Claude's additions for her to approve: the full storage list and the
 * product-link reading (/api/link-preview), which her draft did not mention.
 */
export default function PrivacyPage() {
  return (
    <div className="wrap page privacy" style={{ maxWidth: 820, display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 className="h-page">Privacy at Olfia</h1>
      <p className="lead">Your personal scent entries are stored locally in this version of Olfia. Here is how your saved records, website analytics, and email subscriptions are handled.</p>
      <div className="card privacy__body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <h2>Your saved entries</h2>
        <p>Olfia does not currently offer personal accounts. Your Capture entries, room designs, and starred entries are saved in this browser, on this device. They are not uploaded as personal records to an Olfia server.</p>
        <p>Your Fragrance Shelf, including any photos you add, your preferences, your quiz result, and a few display settings are stored in this browser in the same way. When you paste a product link, the link is sent to Olfia’s server, which reads that page to fill in the product’s details.</p>

        <h2>Website analytics</h2>
        <p>Olfia uses Google Analytics to understand visits and selected actions, such as completing the quiz, saving a Scent Card, or opening a product link. Analytics may use cookies to distinguish visits. Events include categories such as a fragrance family rather than the text you enter.</p>

        <h2>Cookie preferences and signals</h2>
        <p>For visitors in the EU, the UK and Switzerland, and for browsers that send Global Privacy Control or Do Not Track signals, analytics cookies remain off and Google receives cookieless signals. Advertising features are disabled for all visitors.</p>

        <h2>Email subscriptions</h2>
        <p>If you subscribe, your email address is sent to Kit, the service Olfia uses to send emails. Your answer to “Where did you find Olfia?” is counted in Google Analytics and is not stored with your email address. You can unsubscribe using the link in any email.</p>

        <h2>Google Analytics and your choices</h2>
        <ul>
          <li><a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">How Google uses information from sites that use its services</a></li>
          <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics opt-out add-on</a></li>
        </ul>

        <h2>Exporting or removing your saved data</h2>
        <p>Use Export my data in Settings to keep a copy of your local entries. To remove them, choose Clear this browser in Settings or clear Olfia’s site data through your browser settings.</p>
      </div>
    </div>
  );
}
