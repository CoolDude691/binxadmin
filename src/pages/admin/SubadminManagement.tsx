import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

const subadminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type SubadminForm = z.infer<typeof subadminSchema>;

interface Subadmin extends SubadminForm {
  id: string;
  created_at: string;
}

const SubadminManagement: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingSubadmin, setEditingSubadmin] = useState<Subadmin | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const { data: subadmins = [], isLoading, isError, refetch } = useQuery(['subadmins'], async () => {
    const response = await fetch('/api/admin/subadmins');
    if (!response.ok) throw new Error('Failed to fetch subadmins');
    return response.json();
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm<SubadminForm>({
    resolver: zodResolver(subadminSchema),
  });

  const createMutation = useMutation(
    async (data: SubadminForm) => {
      const response = await fetch('/api/admin/subadmins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create subadmin');
      return response.json();
    },
    {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Subadmin created successfully' });
        setOpen(false);
        reset();
        refetch();
      },
      onError: () => {
        toast({ title: 'Error', description: 'Failed to create subadmin', variant: 'destructive' });
      }
    }
  );

  const updateMutation = useMutation(
    async (data: SubadminForm) => {
      const response = await fetch(`/api/admin/subadmins/${editingSubadmin?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update subadmin');
      return response.json();
    },
    {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Subadmin updated successfully' });
        setOpen(false);
        reset();
        refetch();
      },
      onError: () => {
        toast({ title: 'Error', description: 'Failed to update subadmin', variant: 'destructive' });
      }
    }
  );

  const deleteMutation = useMutation(
    async (id: string) => {
      const response = await fetch(`/api/admin/subadmins/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete subadmin');
    },
    {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Subadmin deleted successfully' });
        refetch();
      },
      onError: () => {
        toast({ title: 'Error', description: 'Failed to delete subadmin', variant: 'destructive' });
      }
    }
  );

  const onSubmit = (data: SubadminForm) => {
    editingSubadmin ? updateMutation.mutate(data) : createMutation.mutate(data);
  };

  const handleOpen = (subadmin: Subadmin | null) => {
    setEditingSubadmin(subadmin);
    if (subadmin) {
      reset(subadmin);
    } else {
      reset({ name: '', email: '', phone: '', status: 'active' });
    }
    setOpen(true);
  };

  const filteredSubadmins = subadmins.filter((s: Subadmin) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError) return <div className="p-4 text-red-600">Error loading subadmins</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Subadmin Management</h1>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpen(null)}>Create Subadmin</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSubadmin ? 'Edit Subadmin' : 'Create Subadmin'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input {...field} placeholder="Name" />
                      {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input {...field} placeholder="Email" type="email" />
                      {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Input {...field} placeholder="Phone (optional)" />
                      {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <select {...field} className="w-full border rounded px-3 py-2">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>}
                    </div>
                  )}
                />
                <Button type="submit" className="w-full">
                  {editingSubadmin ? 'Update' : 'Create'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubadmins.map((subadmin: Subadmin) => (
              <TableRow key={subadmin.id}>
                <TableCell>{subadmin.name}</TableCell>
                <TableCell>{subadmin.email}</TableCell>
                <TableCell>{subadmin.phone || '-'}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-sm ${subadmin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}> 
                    {subadmin.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(subadmin.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpen(subadmin)}> 
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(subadmin.id)}> 
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubadminManagement;