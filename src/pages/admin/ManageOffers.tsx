import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";

interface Offer {
    id: number;
    title: string;
    percentage: number;
    valid_from: string;
    valid_to: string;
    min_deposit: number;
    status: number;
}

const ManageOffers = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Offer | null>(null);

    const API = "https://api.binxtrade.in/adminapi/offers.php";

    const fetchOffers = async () => {
        setLoading(true);
        const res = await fetch(API);
        const data = await res.json();
        if (data.success) setOffers(data.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const payload = {
            id: editing?.id,
            title: form.get("title"),
            percentage: Number(form.get("percentage")),
            valid_from: form.get("valid_from"),
            valid_to: form.get("valid_to"),
            min_deposit: Number(form.get("min_deposit")),
            status: Number(form.get("status")),
        };

        await fetch(API, {
            method: editing ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        setEditing(null);
        e.target.reset();
        fetchOffers();
    };

    const deleteOffer = async (id: number) => {
        await fetch(API, {
            method: "DELETE",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `id=${id}`,
        });
        fetchOffers();
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Manage Offers</h1>

                <GlassCard className="p-6 border border-border/40 bg-gradient-to-br from-background to-muted/20">
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Offer Title
                            </label>
                            <input
                                name="title"
                                required
                                defaultValue={editing?.title}
                                placeholder="Deposit Offer"
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Percentage (%)
                            </label>
                            <input
                                name="percentage"
                                type="number"
                                step="0.01"
                                required
                                defaultValue={editing?.percentage}
                                placeholder="3"
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Valid From
                            </label>
                            <input
                                name="valid_from"
                                type="date"
                                required
                                defaultValue={editing?.valid_from}
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Valid To
                            </label>
                            <input
                                name="valid_to"
                                type="date"
                                required
                                defaultValue={editing?.valid_to}
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Minimum Deposit (₹)
                            </label>
                            <input
                                name="min_deposit"
                                type="number"
                                step="0.01"
                                required
                                defaultValue={editing?.min_deposit}
                                placeholder="500"
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Status
                            </label>
                            <select
                                name="status"
                                defaultValue={editing?.status ?? 1}
                                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 pt-2">
                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                            >
                                {editing ? "Update Offer" : "Create Offer"}
                            </button>
                        </div>

                    </form>
                </GlassCard>

                <GlassCard className="p-4">
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <div className="space-y-3">
                            {offers.map((offer) => (
                                <div key={offer.id} className="flex justify-between items-center border-b pb-2">
                                    <div>
                                        <div className="font-semibold">{offer.title} ({offer.percentage}%)</div>
                                        <div className="text-sm text-muted-foreground">
                                            {offer.valid_from} - {offer.valid_to} | Min ₹{offer.min_deposit}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditing(offer)}>
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => deleteOffer(offer.id)}>
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </GlassCard>
            </div>
        </AdminLayout>
    );
};

export default ManageOffers;