import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, Ban, CheckCircle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Channel = {
    id: string;
    title: string;
    channel_link: string;
    status: "active" | "inactive";
    created_at: string;
};

const API = "https://api.binxtrade.in/adminapi/telegram.php"

const TelegramManagement = () => {

    const [channels, setChannels] = useState<Channel[]>([])
    const [selected, setSelected] = useState<Channel | null>(null)

    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const [form, setForm] = useState<Partial<Channel>>({})

    const loadData = () => {
        fetch(API + "?action=list")
            .then(res => res.json())
            .then(data => setChannels(data))
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleCreate = () => {

        fetch(API + "?action=create", {
            method: "POST",
            body: JSON.stringify(form)
        })

        setIsCreateOpen(false)
        setForm({})
        loadData()

    }

    const handleUpdate = () => {

        fetch(API + "?action=update", {
            method: "POST",
            body: JSON.stringify({
                id: selected?.id,
                ...form
            })
        })

        setIsEditOpen(false)
        setSelected(null)
        setForm({})
        loadData()

    }

    const handleDelete = () => {

        fetch(API + "?action=delete", {
            method: "POST",
            body: JSON.stringify({
                id: selected?.id
            })
        })

        setIsDeleteOpen(false)
        setSelected(null)
        loadData()

    }

    const toggleStatus = (row: Channel) => {

        fetch(API + "?action=update", {
            method: "POST",
            body: JSON.stringify({
                id: row.id,
                title: row.title,
                channel_link: row.channel_link,
                status: row.status === "active" ? "inactive" : "active"
            })
        })

        loadData()

    }

    const columns = [
        { key: "id", label: "ID" },
        { key: "title", label: "Title", sortable: true },
        {
            key: "channel_link",
            label: "Channel",
            render: (row: Channel) => (
                <a
                    href={row.channel_link}
                    target="_blank"
                    className="text-primary underline"
                >
                    Join Channel
                </a>
            )
        },
        {
            key: "status",
            label: "Status",
            render: (row: Channel) => (
                <span
                    className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        row.status === "active"
                            ? "bg-accent/20 text-accent"
                            : "bg-secondary/20 text-secondary"
                    )}
                >
                    {row.status}
                </span>
            )
        },
        { key: "created_at", label: "Created" }
    ]

    const actions = (row: Channel) => (
        <div className="flex items-center gap-2 justify-end">

            <button
                onClick={() => {
                    setSelected(row)
                    setIsViewOpen(true)
                }}
                className="p-1.5 rounded hover:bg-muted/50"
            >
                <Eye className="w-4 h-4" />
            </button>

            <button
                onClick={() => {
                    setSelected(row)
                    setForm(row)
                    setIsEditOpen(true)
                }}
                className="p-1.5 rounded hover:bg-muted/50"
            >
                <Edit className="w-4 h-4" />
            </button>

            <button
                onClick={() => toggleStatus(row)}
                className={cn(
                    "p-1.5 rounded",
                    row.status === "active"
                        ? "text-secondary"
                        : "text-accent"
                )}
            >
                {row.status === "active"
                    ? <Ban className="w-4 h-4" />
                    : <CheckCircle className="w-4 h-4" />
                }
            </button>

            <button
                onClick={() => {
                    setSelected(row)
                    setIsDeleteOpen(true)
                }}
                className="p-1.5 rounded text-secondary"
            >
                <Trash2 className="w-4 h-4" />
            </button>

        </div>
    )

    return (

        <AdminLayout>

            <div className="space-y-6">

                <div className="flex justify-between items-center">

                    <div>
                        <h1 className="text-2xl font-bold">Telegram Channels</h1>
                        <p className="text-muted-foreground">
                            Manage official telegram links
                        </p>
                    </div>

                    <Button
                        className="btn-glow"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Channel
                    </Button>

                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                    <GlassCard className="p-4">
                        <p className="text-sm text-muted-foreground">
                            Total Channels
                        </p>
                        <p className="text-2xl font-bold">
                            {channels.length}
                        </p>
                    </GlassCard>

                    <GlassCard className="p-4">
                        <p className="text-sm text-muted-foreground">
                            Active
                        </p>
                        <p className="text-2xl font-bold text-accent">
                            {channels.filter(c => c.status === "active").length}
                        </p>
                    </GlassCard>

                    <GlassCard className="p-4">
                        <p className="text-sm text-muted-foreground">
                            Inactive
                        </p>
                        <p className="text-2xl font-bold text-secondary">
                            {channels.filter(c => c.status === "inactive").length}
                        </p>
                    </GlassCard>

                    <GlassCard className="p-4">
                        <p className="text-sm text-muted-foreground">
                            Latest
                        </p>
                        <p className="text-lg font-mono">
                            {channels[0]?.created_at || "-"}
                        </p>
                    </GlassCard>

                </div>

                <DataTable
                    data={channels}
                    columns={columns}
                    actions={actions}
                    searchKeys={["id", "title"]}
                    searchPlaceholder="Search channels..."
                />

                <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                    <DialogContent>

                        {selected && (

                            <div className="space-y-4">

                                <h3 className="text-xl font-bold">
                                    {selected.title}
                                </h3>

                                <p className="text-muted-foreground break-all">
                                    {selected.channel_link}
                                </p>

                                <span
                                    className={cn(
                                        "px-2 py-1 rounded-full text-xs font-medium",
                                        selected.status === "active"
                                            ? "bg-accent/20 text-accent"
                                            : "bg-secondary/20 text-secondary"
                                    )}
                                >
                                    {selected.status}
                                </span>

                            </div>

                        )}

                    </DialogContent>
                </Dialog>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent>

                        <DialogHeader>
                            <DialogTitle>Add Channel</DialogTitle>
                        </DialogHeader>

                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Title"
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />

                        <input
                            className="w-full p-2 border rounded"
                            placeholder="Telegram Link"
                            onChange={(e) => setForm({ ...form, channel_link: e.target.value })}
                        />

                        <select
                            className="w-full p-2 border rounded"
                            onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                        >

                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>

                        </select>

                        <DialogFooter>

                            <Button onClick={handleCreate}>
                                Create
                            </Button>

                        </DialogFooter>

                    </DialogContent>
                </Dialog>

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>

                        <DialogHeader>
                            <DialogTitle>Edit Channel</DialogTitle>
                        </DialogHeader>

                        <input
                            className="w-full p-2 border rounded"
                            value={form.title || ""}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />

                        <input
                            className="w-full p-2 border rounded"
                            value={form.channel_link || ""}
                            onChange={(e) => setForm({ ...form, channel_link: e.target.value })}
                        />

                        <select
                            className="w-full p-2 border rounded"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                        >

                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>

                        </select>

                        <DialogFooter>

                            <Button onClick={handleUpdate}>
                                Save
                            </Button>

                        </DialogFooter>

                    </DialogContent>
                </Dialog>

                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent>

                        <p>
                            Delete <strong>{selected?.title}</strong> ?
                        </p>

                        <DialogFooter>

                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>

                        </DialogFooter>

                    </DialogContent>
                </Dialog>

            </div>

        </AdminLayout>

    )

}

export default TelegramManagement