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
import { formatDuration } from "@/lib/utils";
import { getSongs, deleteArtist, addSong } from "@/lib/requests";
import SongUpload from "@/components/SongUpload";
import ImageUpload from "@/components/ImageUpload";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { get, add, deleteRecommendation } from "@/lib/requests";
import { type Album, type Singer } from "@/types";
import { format } from "date-fns";

export type Song = {
  id: string;
  title: string;
  duration: string;
  album_id: string;
  artist_id: string;
  coverImg: string;
};

const Edit = ({
  successCallback,
  singer,
  clearSinger,
}: {
  successCallback: () => void;
  singer: Singer;
  clearSinger: () => void;
}) => {
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

  function onSubmit(data: Song) {
    console.log("data", data);
    setLoading(true);

    addSong(data).finally(() => {
      setLoading(false);
      setOpen(false);
      toast({
        title: "歌手添加成功!",
      });
      successCallback();
    });
  }

  return (
    <Dialog open={Boolean(singer)} onOpenChange={clearSinger}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加歌手</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SongUpload />
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

  const [albums, setAlbums] = useState<Album[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<Album>({
    defaultValues: {},
  });

  useEffect(() => {
    get("/albums").then((data) => setAlbums(data));
  }, []);

  function onSubmit(data: Album) {
    add("/addRecommendation", { albumId: data.id }).finally(() => {
      setLoading(false);
      setOpen(false);
      toast({
        title: "歌曲上传成功！",
      });
      successCallback();
    });
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <Button onClick={() => setOpen(true)}>新增推荐</Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增推荐</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>专辑列表</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择专辑" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {albums.map((album) => (
                        <SelectItem key={album.id} value={album.id + ""}>
                          {album.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {loading && <Loader2 className="mr-2 spin" />}
                确定
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
}: {
  deleteRow: (id: string) => void;
}) => ColumnDef<Album>[] = ({ deleteRow }) => [
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
    accessorKey: "coverImage",
    header: "专辑封面",
    cell: ({ row }) => (
      <img src={row.getValue("coverImage")} className="h-8 w-8 rounded-sm" />
    ),
  },
  {
    accessorKey: "title",
    header: "专辑名称",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "artist",
    header: "专辑作者",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("artist")?.name}</div>
    ),
  },
  {
    accessorKey: "releaseDate",
    header: "发行日期",
    cell: ({ row }) => (
      <div className="lowercase">
        {format(row.getValue("releaseDate"), "yyyy-MM-dd")}
      </div>
    ),
  },
  {
    accessorKey: "genre",
    header: "专辑风格",
    cell: ({ row }) => <div className="lowercase">{row.getValue("genre")}</div>,
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
export default function Recommendations() {
  const [data, setData] = useState<Album[]>([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const { toast } = useToast();
  const [editingSinger, setEditingSinger] = useState<Singer | null>(null);

  useEffect(() => {
    if (shouldRefresh) {
      get("/recommendations")
        .then((data) => setData(data))
        .finally(() => setShouldRefresh(false));
    }
  }, [shouldRefresh]);

  useEffect(() => {
    get("/recommendations").then((data) => setData(data));
  }, []);

  console.log({ data });

  return (
    <>
      <DataTable
        data={data}
        columns={
          columns({
            deleteRow: (id) =>
              deleteRecommendation(id).then(() => {
                setShouldRefresh(true);
                toast({
                  title: "推荐专辑删除成功!",
                });
              }),
          }) as any
        }
        addData={<Add successCallback={() => setShouldRefresh(true)} />}
      />
    </>
  );
}
