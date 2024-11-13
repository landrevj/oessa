{ pkgs ? import <nixpkgs> {} }:

let
  nodejs = pkgs.nodejs_22;
in pkgs.mkShell {
  packages = with pkgs; [
    nodejs
    nodePackages.npm
    (yarn.override { nodejs = nodejs; })
  ];

  shellHook = ''
    export PATH="$PWD/node_modules/.bin/:$PATH"
  '';
}