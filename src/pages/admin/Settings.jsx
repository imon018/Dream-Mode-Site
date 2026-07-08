import { useState } from "react";
import Button from "../../components/ui/Button";

export default function Settings() {
  const [settings, setSettings] = useState({
    storeName: "Dream Mode",
    email: "",
    phone: "",
    address: "",
    facebook: "",
    whatsapp: "",
  });

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert(
      "Settings save feature will be connected to Firestore next."
    );
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">
        System Settings
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">

        <input
          type="text"
          name="storeName"
          value={settings.storeName}
          onChange={handleChange}
          placeholder="Store Name"
          className="w-full border rounded-xl p-3"
        />

        <input
          type="email"
          name="email"
          value={settings.email}
          onChange={handleChange}
          placeholder="Store Email"
          className="w-full border rounded-xl p-3"
        />

        <input
          type="text"
          name="phone"
          value={settings.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full border rounded-xl p-3"
        />

        <textarea
          rows={4}
          name="address"
          value={settings.address}
          onChange={handleChange}
          placeholder="Store Address"
          className="w-full border rounded-xl p-3"
        />

        <input
          type="text"
          name="facebook"
          value={settings.facebook}
          onChange={handleChange}
          placeholder="Facebook URL"
          className="w-full border rounded-xl p-3"
        />

        <input
          type="text"
          name="whatsapp"
          value={settings.whatsapp}
          onChange={handleChange}
          placeholder="WhatsApp Number"
          className="w-full border rounded-xl p-3"
        />

        <Button onClick={handleSave}>
          Save Settings
        </Button>

      </div>
    </div>
  );
}
