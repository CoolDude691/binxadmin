import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Pencil, Trash2, Loader2 } from "lucide-react";

interface Reward {
    id: number;
    deposit_amount: number;
    bonus_amount: number;
    is_popular: number;
    status: number;
}

const ManageRewards = () => {

    const API = "https://api.binxtrade.in/adminapi/rewards.php";
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Reward | null>(null);

    const fetchRewards = async () => {
        setLoading(true);
        const res = await fetch(API);
        const data = await res.json();
        if (data.success) setRewards(data.data);
        setLoading(false);
    };

    useEffect(() => { fetchRewards(); }, []);

    const submit = async (e: any) => {
        e.preventDefault();
        const f = new FormData(e.target);
        const payload = {
            id: editing?.id,
            deposit_amount: Number(f.get("deposit_amount")),
            bonus_amount: Number(f.get("bonus_amount")),
            is_popular: Number(f.get("is_popular")),
            status: Number(f.get("status"))
        };

        await fetch(API, {
            method: editing ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        setEditing(null);
        e.target.reset();
        fetchRewards();
    };

    const remove = async (id: number) => {
        await fetch(API, {
            method: "DELETE",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `id=${id}`
        });
        fetchRewards();
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Manage Rewards</h1>

                <GlassCard className="p-8 border border-border/40 bg-gradient-to-br from-background to-muted/20">

                    <form onSubmit={submit} className="grid md:grid-cols-2 gap-8">

                        {/* Deposit Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Deposit Amount (₹)
                            </label>
                            <input
                                name="deposit_amount"
                                type="number"
                                step="0.01"
                                required
                                defaultValue={editing?.deposit_amount}
                                placeholder="500"
                                className="w-full px-4 py-3 rounded-2xl bg-background/80 border border-border 
                   focus:outline-none focus:ring-2 focus:ring-primary 
                   focus:border-transparent transition-all shadow-inner"
                            />
                        </div>

                        {/* Bonus Amount */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Bonus Amount (₹)
                            </label>
                            <input
                                name="bonus_amount"
                                type="number"
                                step="0.01"
                                required
                                defaultValue={editing?.bonus_amount}
                                placeholder="55"
                                className="w-full px-4 py-3 rounded-2xl bg-background/80 border border-border 
                   focus:outline-none focus:ring-2 focus:ring-primary 
                   focus:border-transparent transition-all shadow-inner"
                            />
                        </div>

                        {/* Popular Dropdown */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Reward Type
                            </label>
                            <select
                                name="is_popular"
                                defaultValue={editing?.is_popular ?? 0}
                                className="w-full px-4 py-3 rounded-2xl bg-background/80 border border-border 
                   focus:outline-none focus:ring-2 focus:ring-primary 
                   focus:border-transparent transition-all shadow-inner"
                            >
                                <option value="0">Normal</option>
                                <option value="1">🔥 Popular</option>
                            </select>
                        </div>

                        {/* Status Dropdown */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Status
                            </label>
                            <select
                                name="status"
                                defaultValue={editing?.status ?? 1}
                                className="w-full px-4 py-3 rounded-2xl bg-background/80 border border-border 
                   focus:outline-none focus:ring-2 focus:ring-primary 
                   focus:border-transparent transition-all shadow-inner"
                            >
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 pt-2">
                            <button
                                type="submit"
                                className="w-full py-4 rounded-2xl font-semibold text-white
                   bg-gradient-to-r from-primary to-primary/80
                   hover:opacity-90 transition-all
                   shadow-lg shadow-primary/30"
                            >
                                {editing ? "Update Reward" : "Create Reward"}
                            </button>
                        </div>

                    </form>
                </GlassCard>

                <GlassCard className="p-4">
                    {loading ? <Loader2 className="animate-spin" /> :
                        rewards.map(r => (
                            <div key={r.id}
                                className="flex justify-between items-center border-b pb-2 mb-2">
                                <div>
                                    ₹{r.deposit_amount} → ₹{r.bonus_amount}
                                    {r.is_popular === 1 && <span className="ml-2 text-warning">🔥 Popular</span>}
                                </div>
                                <div className="flex gap-3">
                                    <Pencil onClick={() => setEditing(r)} className="cursor-pointer" />
                                    <Trash2 onClick={() => remove(r.id)} className="cursor-pointer text-red-500" />
                                </div>
                            </div>
                        ))
                    }
                </GlassCard>
            </div>
        </AdminLayout>);
};

export default ManageRewards;