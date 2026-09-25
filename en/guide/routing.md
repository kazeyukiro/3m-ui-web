---
title: Routing
description: 3m-ui · Routing
---

# Routing

**WARP:** Registration lives under System settings (YAML only). It is not applied as server-side routing.

        ## Two different things

        
          PageWhat it controls
          
            **Routing****Client subscription only**: `rules` + `proxy-groups` go into user Mihomo/Clash YAML. The panel server always uses `MATCH,DIRECT` — no server-side split.
            **Config engine**Builds the final `config.yaml` for Mihomo: default template + enabled fragments + **Listeners**. Visual routing (rules/groups) is excluded from the server file.
          
        
        After you set templates/groups, **save and update the subscription in the client**. Server Mihomo does not apply these rules.

        ## How to use Routing

        

          - Open **Routing** in the panel.

          - **Proxy groups**: add groups (`select` / `url-test` / `fallback` / `load-balance`) and list members (`DIRECT`, outbound names, other groups).

          - **Rules**: add rows (type + match value + target). Reorder with up/down. Use **Templates** for presets (DIRECT only, CN direct, community packs, etc.).

          - Click **Save**, then **Generate & apply** (or confirm the prompt) so Mihomo reloads.

        

                **Community templates** also create matching `proxy-groups` (e.g. 代理 / AI / TG, or Google / Telegram / 漏网之鱼). Leaf members default to existing outbounds or `DIRECT`; assign real nodes into those groups after applying.

        GEOSITE/GEOIP templates need MetaCubeX geodata — update under **Settings → Geo**.

        ## How to use Config engine

        

          - Open **Config** (config engine).

          - **Visual** tab: mode / DNS / optional outbound proxies (related to routing).

          - **YAML**: **Generate** builds config from DB (does not write to disk yet). **Validate** runs `mihomo -t`. **Apply** writes config and reloads the core; failure rolls back the previous file.

        

        
```
Edit nodes/users/routing → Generate → Validate → Apply → Core health check
                                      └ on failure: automatic rollback
```

        Creating or editing a **Listener** also triggers config regeneration; use Config when you need a full preview or manual apply.

        ## Typical workflows

        

          - **Inbound only**: leave rules as `MATCH,DIRECT`; manage nodes under Listeners; use Config only if apply failed.

          - **CN direct + rest via group**: Routing → template “CN direct” or community YiXuan/echs/MyClash → Save → Apply. Ensure Geo files exist.

        

        ## API (summary)

        
```
GET/PUT /api/v1/config/rules
GET/PUT /api/v1/config/groups
POST    /api/v1/config/generate
POST    /api/v1/config/validate
POST    /api/v1/config/apply
```


---

## 补充说明（仓库文档）

# Routing (client subscription)

The **Routing** page edits **client subscription** layout only: Mihomo/Clash `proxy-groups` and `rules` stored in the `visual-config` fragment.

- Community templates (YiXuanZX / echs-top / AIsouler) fill groups + rules for the **client** YAML. Switching a template **replaces** rules and groups (does not only append).
- After apply/save, update the subscription in the client (Mihomo/Clash YAML target).
- The **panel Mihomo process** always uses `MATCH,DIRECT` (inbound panel). Visual rules/groups/proxies are **not** merged into the serving `config.yaml`.

Cloudflare WARP registration is under **Settings**, not Routing. See [WARP](warp.md).

## Config engine

**Generate & apply** rebuilds listener config for the server core. It does not apply client community rules to the host process.

