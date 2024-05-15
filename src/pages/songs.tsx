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
import { getSongs, deleteSong, addSong, updateSong } from "@/lib/requests";
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
import { get } from "@/lib/requests";
import { type Album, type Singer, type Song } from "@/types";

const Edit = ({
  successCallback,
  song,
  clearSong,
}: {
  successCallback: () => void;
  song: Song;
  clearSong: () => void;
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const form = useForm<Song & { albumId: string }>({
    defaultValues: song,
  });
  const filePath = form.watch("filePath");

  useEffect(() => {
    if (!song) return;
    get("/albums")
      .then((data) => setAlbums(data))
      .then(() => {
        Object.keys(song).forEach((key) => {
          if (key === "album") {
            form.setValue("albumId", song.album.id + "");
          }

          form.setValue(
            key as keyof typeof song,
            song[key as keyof typeof song],
          );
        });
      });
  }, [song]);

  function onSubmit(data: Song) {
    setLoading(true);

    updateSong(data).finally(() => {
      setLoading(false);
      setOpen(false);
      toast({
        title: "歌曲修改成功！",
      });
      successCallback();
    });
  }

  return (
    <Dialog open={Boolean(song)} onOpenChange={clearSong}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑歌曲</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="albumId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>所属专辑</FormLabel>
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
            <SongUpload filePath={filePath} />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>歌曲名</FormLabel>
                  <FormControl>
                    <Input placeholder="歌曲名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>时长（秒）</FormLabel>
                  <FormControl>
                    <Input placeholder="歌曲时长" {...field} />
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
  const form = useForm<Song & { albumId: string }>({
    defaultValues: {},
  });

  useEffect(() => {
    get("/albums").then((data) => setAlbums(data));
  }, []);

  function onSubmit(data: Song) {
    console.log("data", data);
    addSong(data).finally(() => {
      setLoading(false);
      setOpen(false);
      toast({
        title: "歌曲上传成功！",
      });
      form.reset({});
      successCallback();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        form.reset({});
      }}
    >
      <Button onClick={() => setOpen(true)}>上传歌曲</Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>上传歌曲</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="albumId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>所属专辑</FormLabel>
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
            <SongUpload />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>歌曲名</FormLabel>
                  <FormControl>
                    <Input placeholder="歌曲名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>时长（秒）</FormLabel>
                  <FormControl>
                    <Input placeholder="歌曲时长" {...field} />
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

export const columns: ({
  deleteRow,
  edit,
}: {
  deleteRow: (id: string) => void;
  edit: (v: Song) => void;
}) => ColumnDef<Song>[] = ({ deleteRow, edit }) => [
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
    accessorKey: "title",
    header: "歌曲名",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "album",
    header: "所属专辑",
    cell: ({ row }) => (
      // @ts-ignore
      <div className="capitalize">{row.getValue("album")?.title}</div>
    ),
  },
  {
    accessorKey: "artist",
    header: "歌手",
    cell: ({ row }) => (
      // @ts-ignore
      <div className="capitalize">{row.getValue("artist")?.name}</div>
    ),
  },
  {
    accessorKey: "duration",
    header: "时长",
    cell: ({ row }) => (
      <div className="lowercase">
        {formatDuration(row.getValue("duration"))}
      </div>
    ),
  },
  {
    accessorKey: "filePath",
    header: "文件",
    cell: ({ row }) => (
      <audio controls>
        <source src={row.getValue("filePath")} type="audio/mp3" />
      </audio>
    ),
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
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  useEffect(() => {
    if (shouldRefresh) {
      getSongs()
        .then((data) => setData(data))
        .finally(() => setShouldRefresh(false));
    }
  }, [shouldRefresh]);

  useEffect(() => {
    getSongs().then((data) => setData(data));
  }, []);

  return (
    <>
      <DataTable
        data={data}
        columns={
          columns({
            edit: (v: Song) => setEditingSong(v),
            deleteRow: (id) =>
              deleteSong(id).then(() => {
                setShouldRefresh(true);
                toast({
                  title: "歌曲删除成功!",
                });
              }),
          }) as any
        }
        addData={<Add successCallback={() => setShouldRefresh(true)} />}
      />
      <Edit
        song={editingSong!}
        clearSong={() => setEditingSong(null)}
        successCallback={() => {
          setEditingSong(null);
          setShouldRefresh(true);
        }}
      />
    </>
  );
}
