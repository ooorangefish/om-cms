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
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { getSongs, deleteArtist, addSong, deleteAlbum } from "@/lib/requests";
import SongUpload from "@/components/SongUpload";
import ImageUpload from "@/components/ImageUpload";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { add, get, updateAlbum } from "@/lib/requests";
import { type Album } from "@/types";

const Edit = ({
  successCallback,
  album,
  clearAlbum,
}: {
  successCallback: () => void;
  album: Album;
  clearAlbum: () => void;
}) => {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();

  const form = useForm<Album & { artistId: string }>({
    defaultValues: album,
  });
  const [artists, setArtists] = useState<Singer[]>([]);

  useEffect(() => {
    if (!album) return;
    console.log(album);
    get("/artists")
      .then((data) => {
        setArtists(data);
      })
      .then(() => {
        Object.keys(album).forEach((key) => {
          if (key === "artist") {
            form.setValue("artistId", album.artist.id + "");
          }

          if (key === "releaseDate") {
            setDate(new Date(album.releaseDate));
          }

          form.setValue(
            key as keyof typeof album,
            album[key as keyof typeof album],
          );
        });
      });
  }, [album]);

  useEffect(() => {
    if (date) {
      form.setValue("releaseDate", format(date, "yyyy-MM-dd"));
    }
  }, [date]);

  // useEffect(() => {
  //   if (!singer) return;
  //   form.setValue("name", singer.name);
  //   form.setValue("bio", singer.bio);
  //   form.setValue("profileImg", singer.profileImg);
  // }, [singer]);

  function onSubmit(data: any) {
    console.log("data", data);
    setLoading(true);

    updateAlbum(data).finally(() => {
      setLoading(false);
      setOpen(false);
      toast({
        title: "专辑编辑成功!",
      });
      successCallback();
    });
  }

  return (
    <Dialog open={Boolean(album)} onOpenChange={clearAlbum}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑专辑</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Label>专辑封面</Label>
            <ImageUpload formField="coverImage" />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>专辑名称</FormLabel>
                  <FormControl>
                    <Input placeholder="专辑名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>专辑作者</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择歌手" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id + ""}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="releaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>发行日期</FormLabel>
                  <FormControl>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "yyyy-MM-dd")
                            ) : (
                              <span>选择日期</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>专辑风格</FormLabel>
                  <FormControl>
                    <Input placeholder="专辑风格" {...field} />
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

export type Singer = {
  id: string;
  name: string;
  bio: string;
  profileImg: string;
};

const Add = ({ successCallback }: { successCallback: () => void }) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<Album & { artistId: string }>({
    defaultValues: {},
  });
  const [artists, setArtists] = useState<Singer[]>([]);

  useEffect(() => {
    get("/artists").then((data) => {
      setArtists(data);
    });
  }, []);

  useEffect(() => {
    if (date) {
      form.setValue("releaseDate", format(date, "yyyy-MM-dd"));
    }
  }, [date]);

  function onSubmit(data: Album) {
    console.log(data);
    add("/addAlbum", data).finally(() => {
      setLoading(false);
      setOpen(false);
      toast({
        title: "新增专辑成功!",
      });
      successCallback();
    });
  }

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <Button onClick={() => setOpen(true)}>新增专辑</Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新增专辑</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Label>专辑封面</Label>
            <ImageUpload formField="coverImage" />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>专辑名称</FormLabel>
                  <FormControl>
                    <Input placeholder="专辑名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>专辑作者</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择歌手" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id + ""}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="releaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>发行日期</FormLabel>
                  <FormControl>
                    <div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "yyyy-MM-dd")
                            ) : (
                              <span>选择日期</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>专辑风格</FormLabel>
                  <FormControl>
                    <Input placeholder="专辑风格" {...field} />
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
  edit: (v: Album) => void;
}) => ColumnDef<Album>[] = ({ deleteRow, edit }) => [
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
      //@ts-ignore
      <img
        src={process.env.NEXT_PUBLIC_SERVER_URL + row.getValue("coverImage")}
        className="h-8 w-8 rounded-sm"
      />
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
      // @ts-ignore
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

export default function Albums() {
  const [data, setData] = useState<Album[]>([]);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const { toast } = useToast();
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  useEffect(() => {
    if (shouldRefresh) {
      get("/albums")
        .then((data) => setData(data))
        .finally(() => setShouldRefresh(false));
    }
  }, [shouldRefresh]);

  useEffect(() => {
    get("/albums").then((data) => setData(data));
  }, []);

  console.log({ data });

  return (
    <>
      <DataTable
        data={data}
        columns={
          columns({
            // @ts-ignore
            edit: (v: Singer) => setEditingAlbum(v),
            deleteRow: (id) =>
              deleteAlbum(id).then(() => {
                setShouldRefresh(true);
                toast({
                  title: "专辑删除成功!",
                });
              }),
          }) as any
        }
        addData={<Add successCallback={() => setShouldRefresh(true)} />}
      />
      <Edit
        album={editingAlbum!}
        clearAlbum={() => setEditingAlbum(null)}
        successCallback={() => {
          setEditingAlbum(null);
          setShouldRefresh(true);
        }}
      />
    </>
  );
}
