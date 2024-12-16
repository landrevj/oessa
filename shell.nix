{ pkgs ? import <nixpkgs> { } }:

let
  nodejs = pkgs.nodejs_22;
in
pkgs.mkShell {
  packages = with pkgs; [
    (corepack.override { nodejs = nodejs; })
    nodejs
  ];

  shellHook = ''
    export PATH="$PWD/node_modules/.bin/:$PATH"

    alias better-auth="pnpm dlx @better-auth/cli"
    alias nuxi="pnpm dlx nuxi@latest"
    alias shadcn="pnpm dlx shadcn-vue@latest"
  '';
}
