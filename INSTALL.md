# Installation Guide

## Dependencies

Install the following runtime dependencies and [build dependencies](#build-dependencies)

- [NodeJS](https://nodejs.org/en/) Latest LTS
- [pnpm](https://pnpm.io/installation) (Recommended using [Corepack](https://pnpm.io/installation#using-corepack))
- [PostgreSQL](https://www.postgresql.org/) v14+
- [Redis](https://redis.io/) v7+ (Planned to be removed: https://codeberg.org/catodon/catodon/issues/60)
- Reverse Proxy (one of the following)
  - Nginx
  - Caddy
  - Apache
- [libvips](https://www.libvips.org/)
- [PGroonga](https://pgroonga.github.io/)

### Build dependencies

- [Rust](https://www.rust-lang.org/) v1.68.0+ (Planned to be removed: https://codeberg.org/catodon/catodon/issues/61)
- C/C++ compiler & build tools
  - `build-essential` on Debian/Ubuntu Linux
  - `base-devel` on Arch Linux
- [Python 3](https://www.python.org/)

## Prepare required files and dependencies

```sh
git clone -b stable https://codeberg.org/catodon/catodon.git && cd catodon
pnpm install
```

## Prepare PostgreSQL

Create the user and database of PostgreSQL for Catodon, then enable PGroonga.

Change `<user>` and `<database>` in the following commands as you like.

```sh
sudo -iu postgres createuser -P <user>  # Note the password you enter here.
sudo -iu postgres createdb -O <user> -E UTF8 <database>
sudo -iu postgres psql -c "CREATE EXTENSION pgroonga;" <database>
```

## Update configuration file

First, copy the example configuration file.

```sh
cp .config/example.yml .config/default.yml
```

Open `.config/default.yml` via your favourite text editor. At least the following fields need to be updated:

- `url`: the URL of your Catodon server. E.g., `https://catodon.social`
- `db`
  - `db`: the database of PostgreSQL you created in the previous step.
  - `user`: the user of PostgreSQL you created in the previous step.
  - `pass`: the password you entered in the previous step.

## Build and launch

```sh
NODE_ENV=production pnpm run build && pnpm run migrate
NODE_ENV=production pnpm start
```
