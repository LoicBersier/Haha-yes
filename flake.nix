{
  description = "Dev environment for haha-yes";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodejs_20
            typescript-language-server
            nodePackages.typescript
            nodePackages.prettier
            nodePackages.eslint

            yt-dlp
            handbrake
            gifsicle
            gifski
            ffmpeg
          ];

          shellHook = ''
            echo "Entering haha-yes dev environment."
            echo "Node.JS: ${pkgs.nodejs_20.version}"
            echo "yt-dlp: ${pkgs.yt-dlp.version}"
            echo "HandbrakeCLI: ${pkgs.handbrake.version}"
            echo "gifsicle: ${pkgs.gifsicle.version}"
            echo "gifski: ${pkgs.gifski.version}"
            echo "ffmpeg/ffprobe: ${pkgs.ffmpeg.version}"

            echo "Symlinking required binaries to bin"
            ln -vs $(which yt-dlp) bin/yt-dlp
            ln -vs $(which HandBrakeCLI) bin/HandBrakeCLI
            ln -vs $(which ffmpeg) bin/ffmpeg
            ln -vs $(which ffprobe) bin/ffprobe
            ln -vs $(which gifsicle) bin/gifsicle
            ln -vs $(which gifski) bin/gifski

            trap '
              echo "Cleaning up environment"
              rm -v bin/yt-dlp
              rm -v bin/HandBrakeCLI
              rm -v bin/ffmpeg
              rm -v bin/ffprobe
              rm -v bin/gifsicle
              rm -v bin/gifski
            ' EXIT
          '';
        };
      });
}
