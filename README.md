# MOS Hub templates

Templates for running junkerderprovinz's containers on [MOS](https://github.com/mos-nas/mos-releases), the modular server OS by ich777.

## Add this repository to MOS

1. Open **Settings**, **System Configuration**, **MOS Hub Settings**.
2. Add `https://github.com/junkerderprovinz/mos-apps` to the repository list.
3. Refresh the hub. The apps show up next to the ones from the other repositories.

## Apps

| App | What it is |
| --- | --- |
| [ArrowLoop](https://github.com/junkerderprovinz/arrowloop) | Two-way file sync that shows every planned change before it touches a file |
| [JDownloader](https://github.com/junkerderprovinz/jdownloader) | JDownloader 2 with a dark interface in the browser |
| [Krusader](https://github.com/junkerderprovinz/krusader) | The Krusader twin-panel file manager in the browser |
| [Matrix](https://github.com/junkerderprovinz/matrix) | Synapse, coturn and Element in one container (needs a PostgreSQL database) |

Questions and bugs go to the issue tracker of the app's own repository.

## How the templates differ from the Unraid ones

The templates are built from the Unraid templates in [unraid-apps](https://github.com/junkerderprovinz/unraid-apps), with the changes MOS needs:

- Appdata goes to `/mnt/cache/appdata/<app>`, and paths that pointed at `/mnt/user` point at `/mnt/cache`. Change them if your pool has another name.
- `PUID` and `PGID` are `500`, the MOS default user.
- There is no `TZ` field, because MOS passes the system timezone to every container.
- Mounts drop Unraid's `slave` propagation, which Docker refuses on MOS.

## Changing a template

Edit the template in unraid-apps, not the files in `docker/`. A workflow here rebuilds them every night. To build them by hand:

```sh
python3 tools/generate.py ../unraid-apps
```

`apps.json` lists the apps that get a MOS template, their hub categories and the host paths that need a different default on MOS. MOS fills an empty host path with a folder of its own choosing, so an optional mount gets one here.
