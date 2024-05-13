import { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Ellipsis, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { getArtists, deleteArtist } from "@/lib/requests";
import ImageUpload from "@/components/ImageUpload";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Singer } from "@/types";
import { add } from "@/lib/requests";

const Edit = ({
  successCallback,
  singer,
  clearSinger,
}: {
  successCallback: () => void;
  singer: Singer;
  clearSinger: () => void;
}) => {
  console.log("singerrrr", singer);
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<Singer>({
    defaultValues: singer,
  });

  useEffect(() => {
    if (!singer) return;
    form.setValue("name", singer.name);
    form.setValue("bio", singer.bio);
    form.setValue("profileImage", singer.profileImage);
  }, [singer]);

  function onSubmit(data: Singer) {
    console.log("data", data);
    setLoading(true);
    fetch(`http://localhost:3000/updateArtist/${singer.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).finally(() => {
      setLoading(false);
      setOpen(false);
      toast({
        title: "歌手编辑成功!",
      });
      successCallback();
    });
  }

  return (
    <Dialog open={Boolean(singer)} onOpenChange={clearSinger}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑歌手</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ImageUpload formField="profileImage" />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input placeholder="歌手姓名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>简介</FormLabel>
                  <FormControl>
                    <Input placeholder="歌手简介" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {loading && <Loader2 className="mr-2 spin" />}
                保存
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const Add = ({ successCallback }: { successCallback: () => void }) => {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<Singer>({
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  function onSubmit(data: Singer) {
    setLoading(true);
    add("/addArtist", data).finally(() => {
      setLoading(false);
      setOpen(false);
      toast({
        title: "歌手添加成功!",
      });
      successCallback();
    });
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <Button onClick={() => setOpen(true)}>添加歌手</Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加歌手</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ImageUpload formField="profileImage" />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input placeholder="歌手姓名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>简介</FormLabel>
                  <FormControl>
                    <Input placeholder="歌手简介" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>类型</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择类型" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="男">男</SelectItem>
                      <SelectItem value="女">女</SelectItem>
                      <SelectItem value="组合">组合</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>地区</FormLabel>
                  <FormControl>
                    <Input placeholder="所在地区" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {loading && <Loader2 className="mr-2 spin" />}
                保存
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const columns: ({
  deleteRow,
  edit,
}: {
  deleteRow: (id: string) => void;
  edit: (v: Singer) => void;
}) => ColumnDef<Singer>[] = ({ deleteRow, edit }) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "profileImage",
    header: "头像",
    cell: ({ row }) => (
      <img
        src={row.getValue("profileImage")}
        className="h-8 w-8 rounded-full"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "姓名",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "type",
    header: "类型",
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "location",
    header: "地区",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("location")}</div>
    ),
  },
  {
    accessorKey: "bio",
    header: "简介",
    cell: ({ row }) => <div className="lowercase">{row.getValue("bio")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                edit(row.original);
              }}
            >
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => {
                deleteRow(row.original.id);
              }}
            >
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function Singers() {
  const [data, setData] = useState<Singer[]>([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const { toast } = useToast();
  const [editingSinger, setEditingSinger] = useState<Singer | null>(null);

  useEffect(() => {
    if (shouldRefresh) {
      getArtists()
        .then((data) => setData(data))
        .finally(() => setShouldRefresh(false));
    }
  }, [shouldRefresh]);

  useEffect(() => {
    getArtists().then((data) => setData(data));
  }, []);

  return (
    <>
      <DataTable
        data={data}
        columns={
          columns({
            edit: (v: Singer) => setEditingSinger(v),
            deleteRow: (id) =>
              deleteArtist(id).then(() => {
                setShouldRefresh(true);
                toast({
                  title: "歌手删除成功!",
                });
              }),
          }) as any
        }
        addData={<Add successCallback={() => setShouldRefresh(true)} />}
      />
      <Edit
        singer={editingSinger!}
        clearSinger={() => setEditingSinger(null)}
        successCallback={() => {
          setEditingSinger(null);
          setShouldRefresh(true);
        }}
      />
    </>
  );
}
