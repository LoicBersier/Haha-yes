{
  description = "Dev environment for haha-yes";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = nixpkgs.legacyPackages.${system};
        nodejs = pkgs.nodejs_26;
        inherit (pkgs) yt-dlp handbrake gifsicle gifski ffmpeg;
      in {
        devShells.default = pkgs.mkShell {
          packages = [
            nodejs
            yt-dlp
            handbrake
            gifsicle
            gifski
            ffmpeg
          ];

          shellHook = ''
            echo "Entering haha-yes dev environment."
            echo "Node.JS: ${nodejs.version}"
            echo "yt-dlp: ${yt-dlp.version}"
            echo "HandbrakeCLI: ${handbrake.version}"
            echo "gifsicle: ${gifsicle.version}"
            echo "gifski: ${gifski.version}"
            echo "ffmpeg/ffprobe: ${ffmpeg.version}"

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
      }
    );
}
