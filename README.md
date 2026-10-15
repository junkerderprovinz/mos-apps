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


One knight builds this, and AI is one of the tools I work with, the same way I work with an editor or a compiler. It helps me write code and documentation and it checks my work, and that saves me a good many evenings. It does not make the decisions, though. I read and understand everything before it ships, and if something here breaks, that is on me and not on the tool.

You do not have to take my word for it. The code is open and every release note is written by hand. The issue tracker shows how problems actually get handled, including the ones I got wrong the first time. If you find something that is not right, open an issue and I will look at it.

## Support

A one-knight job: I build them, keep them running, work through the issues and add what people ask for, until nothing is missing. They are free, with no accounts, no telemetry, no ads and no paid tier. No asterisk anywhere. Nothing readable ever leaves your own walls. Forged on evenings and weekends, with heart and stubbornness.

If one of these has earned a place on your server or computer, toss a coin to your knight: it helps cover the costs and keeps the project alive. It also makes this knight's heart beat a little faster. Three ways below, whichever suits you.

<p align="center">
  <a href="https://buymeacoffee.com/junkerderprovinz"><img src="https://raw.githubusercontent.com/junkerderprovinz/junkerderprovinz/main/donate/buttons/give.svg#svgView(viewBox(0,0,841.9,245.3))" alt="Buy me a coffee" width="160" height="46.62"></a>
  &nbsp;
  <a href="https://www.paypal.com/donate/?hosted_button_id=76FVV52TKXTUS"><img src="https://raw.githubusercontent.com/junkerderprovinz/junkerderprovinz/main/donate/buttons/give.svg#svgView(viewBox(841.9,0,841.9,245.3))" alt="PayPal" width="160" height="46.62"></a>
  &nbsp;
  <a href="https://junkerderprovinz.github.io/junkerderprovinz/"><img src="https://raw.githubusercontent.com/junkerderprovinz/junkerderprovinz/main/donate/buttons/give.svg#svgView(viewBox(1683.8,0,841.9,245.3))" alt="Donate with crypto" width="160" height="46.62"></a>
</p>
