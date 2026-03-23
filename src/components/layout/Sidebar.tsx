// admin/telegram.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Plus, Save, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function TelegramLinks() {
  const [links, setLinks] = useState([
    { id: 1, name: "Official Channel", url: "https://t.me/tradepro_official", active: true },
    { id: 2, name: "Announcements", url: "https://t.me/tradepro_announcements", active: true },
    { id: 3, name: "Support Group", url: "https://t.me/tradepro_support", active: false },
  ]);

  const [newLink, setNewLink] = useState({ name: "", url: "" });

  const addLink = () => {
    if (newLink.name && newLink.url) {
      setLinks([...links, { ...newLink, id: Date.now(), active: true }]);
      setNewLink({ name: "", url: "" });
    }
  };

  const deleteLink = (id: number) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const toggleLink = (id: number) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, active: !link.active } : link
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Telegram Links Management</h1>
        <Button onClick={addLink} className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Link
        </Button>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid gap-4">
            {links.map(link => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{link.name}</h3>
                  <p className="text-sm text-muted-foreground">{link.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLink(link.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      link.active 
                        ? "bg-green-500/20 text-green-500" 
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {link.active ? "Active" : "Inactive"}
                  </button>
                  <Button variant="ghost" size="icon">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteLink(link.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-4">Add New Telegram Link</h3>
            <div className="flex gap-4">
              <Input
                placeholder="Channel Name"
                value={newLink.name}
                onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
              />
              <Input
                placeholder="Telegram URL"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              />
              <Button onClick={addLink}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}