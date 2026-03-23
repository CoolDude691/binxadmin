import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";

type Settings = {
    bet_requirement: number
    commission_percent: number
    min_deposit: number
    min_withdraw: number
}

const API = "https://api.binxtrade.in/adminapi/settings.php"

const PlatformSettings = () => {

    const [settings, setSettings] = useState<Settings>({
        bet_requirement: 0,
        commission_percent: 0,
        min_deposit: 300,
        min_withdraw: 510
    })

    useEffect(() => {

        fetch(API + "?action=get")
            .then(res => res.json())
            .then(data => setSettings(data))

    }, [])

    const handleSave = () => {

        fetch(API + "?action=update", {
            method: "POST",
            body: JSON.stringify(settings)
        })

        alert("Settings Updated")

    }

    return (

        <AdminLayout>

            <div className="space-y-6">

                <div>
                    <h1 className="text-2xl font-bold">
                        Platform Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage withdrawal rules and commission
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">

                    <GlassCard className="p-6 space-y-4">

                        <h3 className="font-semibold text-lg">
                            Bet Requirement
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            User must complete this trade volume before withdrawal
                        </p>

                        <input
                            type="number"
                            value={settings.bet_requirement}
                            onChange={(e) =>
                                setSettings({ ...settings, bet_requirement: Number(e.target.value) })
                            }
                            className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                    </GlassCard>

                    <GlassCard className="p-6 space-y-4">

                        <h3 className="font-semibold text-lg">
                            Commission Percentage
                        </h3>

                        <input
                            type="number"
                            value={settings.commission_percent}
                            onChange={(e) =>
                                setSettings({ ...settings, commission_percent: Number(e.target.value) })
                            }
                            className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                    </GlassCard>

                    <GlassCard className="p-6 space-y-4">

                        <h3 className="font-semibold text-lg">
                            Minimum Deposit
                        </h3>

                        <input
                            type="number"
                            value={settings.min_deposit}
                            onChange={(e) =>
                                setSettings({ ...settings, min_deposit: Number(e.target.value) })
                            }
                            className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                    </GlassCard>

                    <GlassCard className="p-6 space-y-4">

                        <h3 className="font-semibold text-lg">
                            Minimum Withdrawal
                        </h3>

                        <input
                            type="number"
                            value={settings.min_withdraw}
                            onChange={(e) =>
                                setSettings({ ...settings, min_withdraw: Number(e.target.value) })
                            }
                            className="w-full px-4 py-3 rounded-lg bg-muted/30 border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                    </GlassCard>

                </div>

                <div className="pt-4">

                    <Button onClick={handleSave} className="btn-glow">

                        <Save className="w-4 h-4 mr-2" />

                        Save Settings

                    </Button>

                </div>

            </div>

        </AdminLayout>

    )

}

export default PlatformSettings