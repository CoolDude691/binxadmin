import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown, User, DollarSign, Users, GitBranch, Loader2, Search } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

interface TreeNode {
  id: string;
  name: string;
  email: string;
  level: number;
  referralCount: number;
  earnings: number;
  children: TreeNode[];
  mobile?: string;
  balance?: number;
  status?: string;
  createdAt?: string;
  referred_by?: string;
}

interface TreeNodeProps {
  node: TreeNode;
  level?: number;
  onNodeClick?: (node: TreeNode) => void;
}

const TreeNode = ({ node, level = 0, onNodeClick }: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState<TreeNode[]>(node.children || []);

  const hasChildren = children.length > 0 || node.referralCount > 0;

  const formatCurrency = (value: number) => {
    const safe = Number(value || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(safe);
  };

  const levelColors = [
    "from-primary to-primary-glow",
    "from-accent to-accent/70",
    "from-warning to-warning/70",
    "from-secondary to-secondary/70",
  ];

  const handleExpand = async () => {
    if (!isExpanded && children.length === 0 && node.referralCount > 0) {
      setIsLoading(true);
      try {
        // Fixed: Consistent API endpoint
        const response = await fetch(`https://api.binxtrade.in/adminapi/referral-tree.php?user_id=${node.id}&mode=children`);
        const data = await response.json();
        if (data.success && data.children) {
          setChildren(data.children);
        }
      } catch (error) {
        console.error('Error fetching children:', error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsExpanded(!isExpanded);
    onNodeClick?.(node);
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.1 }}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
          "hover:bg-muted/50 active:scale-[0.98]",
          level > 0 && "ml-6 border-l-2 border-border/50 pl-4"
        )}
        onClick={handleExpand}
      >
        {hasChildren && (
          <button className="p-1 rounded hover:bg-muted/50 transition-colors" onClick={(e) => {
            e.stopPropagation();
            handleExpand();
          }}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
            ) : isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-6" />}

        <div className={cn(
          "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center",
          levelColors[level % levelColors.length]
        )}>
          <User className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{node.name}</p>
            {node.status && (
              <span className={cn(
                "px-2 py-0.5 text-xs rounded-full",
                node.status === 'active' ? "bg-green-100 text-green-800" :
                  node.status === 'inactive' ? "bg-gray-100 text-gray-800" :
                    "bg-yellow-100 text-yellow-800"
              )}>
                {node.status}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{node.email}</p>
          {node.mobile && (
            <p className="text-xs text-muted-foreground truncate">{node.mobile}</p>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <p className="text-muted-foreground">Level {node.level}</p>
            <p className="font-medium">{node.referralCount} referrals</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Earnings</p>
            <p className="font-mono-trading font-semibold text-accent">
              {formatCurrency(node.earnings)}
            </p>
          </div>
          {node.balance !== undefined && (
            <div className="text-right">
              <p className="text-muted-foreground">Balance</p>
              <p className="font-mono-trading font-medium">
                {formatCurrency(node.balance)}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {hasChildren && isExpanded && !isLoading && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="pl-4"
        >
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onNodeClick={onNodeClick}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

const ReferralTree = () => {
  const [rootNode, setRootNode] = useState<TreeNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TreeNode[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const API_BASE = "https://api.binxtrade.in/adminapi";

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  useEffect(() => {
    fetchReferralTree();
  }, [selectedUserId]);

  const fetchReferralTree = async () => {
    setIsLoading(true);
    try {
      const url = selectedUserId
        ? `${API_BASE}/referral-tree.php?user_id=${selectedUserId}&mode=root`
        : `${API_BASE}/referral-tree.php?mode=root`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.root) {
        setRootNode(data.root);
      } else {
        console.error('API Error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching referral tree:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchUser = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/referral-tree.php?search=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        setSearchResults(data.data);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        alert(data.message || 'No users found');
      }
    } catch (error) {
      console.error('Error searching user:', error);
      alert('Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (user: TreeNode) => {
    setSelectedUserId(user.id);
    setSelectedNode(user);
    setShowSearchResults(false);
    setSearchTerm("");
  };

  const calculateTotalEarnings = (node: TreeNode): number => {
    let total = node.earnings || 0;
    node.children?.forEach(child => {
      total += calculateTotalEarnings(child);
    });
    return total;
  };

  const calculateTotalReferrals = (node: TreeNode): number => {
    let total = node.referralCount || 0;
    node.children?.forEach(child => {
      total += calculateTotalReferrals(child);
    });
    return total;
  };

  if (isLoading && !rootNode) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading referral tree...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!rootNode) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No referral data found</p>
          <button
            onClick={fetchReferralTree}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  const totalEarnings = calculateTotalEarnings(rootNode);
  const totalReferrals = calculateTotalReferrals(rootNode);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Referral Tree</h1>
            <p className="text-muted-foreground mt-1">Visualize the multi-level referral structure</p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 relative">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or mobile..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUser()}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
              />

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="text-xs text-muted-foreground">{user.mobile}</div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>Level: {user.level}</span>
                        <span>Referrals: {user.referralCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={searchUser}
              disabled={isLoading || !searchTerm.trim()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
            {selectedUserId && (
              <button
                onClick={() => {
                  setSelectedUserId(null);
                  setSearchTerm("");
                  setSelectedNode(null);
                  setShowSearchResults(false);
                  setSearchResults([]);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Selected Node Info */}
        {selectedNode && (
          <GlassCard className="p-4 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Viewing: {selectedNode.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedNode.email} • Level {selectedNode.level}</p>
                <p className="text-sm text-muted-foreground">Referrals: {selectedNode.referralCount} • Balance: {formatCurrency(selectedNode.balance || 0)}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedUserId(null);
                  setSelectedNode(null);
                  fetchReferralTree();
                }}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                View Full Tree
              </button>
            </div>
          </GlassCard>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Root User</p>
                <p className="text-xl font-bold">{rootNode.name}</p>
                <p className="text-xs text-muted-foreground truncate">{rootNode.email}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{totalReferrals}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold font-mono-trading">{formatCurrency(totalEarnings)}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Level Legend */}
        <GlassCard className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary-glow" />
              <span className="text-sm">Level 0 (Root)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-accent to-accent/70" />
              <span className="text-sm">Level 1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-warning to-warning/70" />
              <span className="text-sm">Level 2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-secondary to-secondary/70" />
              <span className="text-sm">Level 3+</span>
            </div>
          </div>
        </GlassCard>

        {/* Referral Tree */}
        <GlassCard hover={false} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Referral Hierarchy</h3>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowSearchResults(false);
                  setSearchResults([]);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear Search
              </button>
              <button
                onClick={fetchReferralTree}
                disabled={isLoading}
                className="text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh'
                )}
              </button>
            </div>
          </div>
          <div className="space-y-1 max-h-[600px] overflow-y-auto">
            <TreeNode
              node={rootNode}
              onNodeClick={(node) => setSelectedNode(node)}
            />
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  );
};

export default ReferralTree;