<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/banner-dark.png">
    <img src=".github/assets/banner.png" alt="MOS Hub templates: one hub to rule them all" width="100%">
  </picture>
</p>

<p align="center">
  <a href="https://github.com/junkerderprovinz/mos-apps/actions/workflows/generate.yml"><img src="https://img.shields.io/github/actions/workflow/status/junkerderprovinz/mos-apps/generate.yml?branch=main&label=Generate&style=for-the-badge&logo=githubactions&logoColor=white" alt="Generate" height="36"></a>&nbsp;
  <a href="#apps"><img src="https://img.shields.io/badge/Templates-4-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Templates" height="36"></a>&nbsp;
  <a href="https://github.com/junkerderprovinz/mos-apps/commits/main"><img src="https://img.shields.io/github/last-commit/junkerderprovinz/mos-apps?branch=main&style=for-the-badge&logo=git&logoColor=white&label=Updated" alt="Last commit" height="36"></a>&nbsp;
  <a href="https://github.com/mos-nas/mos-releases"><img src="https://img.shields.io/badge/MOS-Hub-1a1a1a?style=for-the-badge&logoColor=white" alt="MOS Hub" height="36"></a>&nbsp;
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License" height="36"></a>
</p>

<p align="center">
<b>MOS Hub</b> templates for junkerderprovinz's containers on <a href="https://github.com/mos-nas/mos-releases">MOS</a>, the modular server OS by ich777, grouped like the profile: <b>Apps</b> (my own software) and <b>Images</b> (my own image builds of third-party apps). One repository to add to the hub; each app's image and full source live in its own repository.
</p>


## Apps

*My own software, built and published by junkerderprovinz. Full docs live in each app's own repository.*

<img src=".github/readme-icons/arrowloop.png" width="84" align="left" alt="ArrowLoop">
<a href="https://github.com/junkerderprovinz/arrowloop#readme"><img src="https://img.shields.io/badge/Repository%20%26%20ReadMe-393939?style=for-the-badge&logo=github&logoColor=white" align="right" alt="Repository &amp; ReadMe"></a>

**ArrowLoop**<br>
Two-way file sync that shows you the plan before it touches a file, sends deletions to a trash and stops a run that would delete too much.

<br clear="all">


## Images

*My own custom image builds of third-party apps. Full docs in each app's own repository.*

<img src=".github/readme-icons/jdownloader.png" width="84" align="left" alt="JDownloader">
<a href="https://github.com/junkerderprovinz/jdownloader#readme"><img src="https://img.shields.io/badge/Repository%20%26%20ReadMe-393939?style=for-the-badge&logo=github&logoColor=white" align="right" alt="Repository &amp; ReadMe"></a>

**JDownloader**<br>
JDownloader 2 with a complete, sleek dark UI out of the box, on a fast Selkies web desktop in your browser. No VNC client, no install.

<br clear="all">

<img src=".github/readme-icons/krusader.png" width="84" align="left" alt="Krusader">
<a href="https://github.com/junkerderprovinz/krusader#readme"><img src="https://img.shields.io/badge/Repository%20%26%20ReadMe-393939?style=for-the-badge&logo=github&logoColor=white" align="right" alt="Repository &amp; ReadMe"></a>

**Krusader**<br>
Twin-pane KDE file manager with a native dark theme on a fast Selkies web desktop, with Kate, krename and RAR built in.

<br clear="all">

<img src=".github/readme-icons/matrix.png" width="84" align="left" alt="Matrix">
<a href="https://github.com/junkerderprovinz/matrix#readme"><img src="https://img.shields.io/badge/Repository%20%26%20ReadMe-393939?style=for-the-badge&logo=github&logoColor=white" align="right" alt="Repository &amp; ReadMe"></a>

**Matrix**<br>
A complete Matrix homeserver in one container: Synapse, coturn, Element Web and the Ketesa admin UI, with optional TURN over TLS. It needs a PostgreSQL database.

<br clear="all">


## Install

On MOS: open **Settings**, **System Configuration**, **MOS Hub Settings**, add `https://github.com/junkerderprovinz/mos-apps` to the repositories and refresh the hub. The apps then show up in the **MOS Hub** next to the ones from the other repositories.

Questions and bugs go to the issue tracker of the app's own repository; every template links it under **Support**.


## How these differ from the Unraid templates

The templates are built from the Unraid templates in [unraid-apps](https://github.com/junkerderprovinz/unraid-apps), with the changes MOS needs:

- Appdata goes to `/mnt/cache/appdata/<app>`, and paths that pointed at `/mnt/user` point at `/mnt/cache`. Change them if your pool has another name.
- `PUID` and `PGID` are `500`, the MOS default user.
- There is no `TZ` field, because MOS passes the system timezone to every container.
- Mounts drop Unraid's `slave` propagation, which Docker refuses on MOS.

To change a template, edit it in unraid-apps, not the files in `docker/`, `images/` or `.github/readme-icons/`. A workflow here rebuilds them every night. To build them by hand:

```sh
python3 tools/generate.py ../unraid-apps
```

`apps.json` lists the apps that get a MOS template, their hub categories and the host paths that need a different default on MOS. MOS fills an empty host path with a folder of its own choosing, so an optional mount gets one here.


## How AI is used here

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
