class MusicPlayer {
  constructor() {
    this.audio = document.getElementById("audioPlayer");
    this.playPauseBtn = document.getElementById("playPauseBtn");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.progressBar = document.getElementById("progressBar");
    this.progress = document.getElementById("progress");
    this.currentTimeEl = document.getElementById("currentTime");
    this.totalTimeEl = document.getElementById("totalTime");
    this.volumeSlider = document.getElementById("volumeSlider");
    this.songTitle = document.getElementById("songTitle");
    this.songArtist = document.getElementById("songArtist");
    this.songDuration = document.getElementById("songDuration");
    this.albumArt = document.getElementById("albumArt");
    this.playlistEl = document.getElementById("playlist");
    this.playlistToggle = document.getElementById("playlistToggle");
    this.autoplayToggle = document.getElementById("autoplayToggle");

    this.currentSongIndex = 0;
    this.isPlaying = false;
    this.autoplay = false;
    this.playlistVisible = false;
    this.playlist = [
      {
        title: "SoundHelix Song 1",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        title: "SoundHelix Song 2",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        title: "SoundHelix Song 3",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        title: "SoundHelix Song 4",
        artist: "SoundHelix",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
    ];

    this.init();
  }

  init() {
    this.loadSong(this.currentSongIndex);
    this.renderPlaylist();
    this.bindEvents();
    this.audio.volume = 0.5;
  }

  bindEvents() {
    this.playPauseBtn.addEventListener("click", () => this.togglePlayPause());
    this.prevBtn.addEventListener("click", () => this.previousSong());
    this.nextBtn.addEventListener("click", () => this.nextSong());
    this.progressBar.addEventListener("click", (e) => this.setProgress(e));
    this.volumeSlider.addEventListener("input", (e) => this.setVolume(e));
    this.audio.addEventListener("loadedmetadata", () => this.updateDuration());
    this.audio.addEventListener("timeupdate", () => this.updateProgress());
    this.audio.addEventListener("ended", () => this.handleSongEnd());
    this.playlistToggle.addEventListener("click", () => this.togglePlaylist());
    this.autoplayToggle.addEventListener("click", () => this.toggleAutoplay());
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }

  loadSong(index) {
    const song = this.playlist[index];
    this.audio.src = song.src;
    this.songTitle.textContent = song.title;
    this.songArtist.textContent = song.artist;
    this.albumArt.textContent = this.getAlbumIcon(index);
    this.updatePlaylistActive();
  }

  getAlbumIcon(index) {
    const icons = ["🎵", "🎶", "🎼", "🎤", "🎸", "🎹", "🥁", "🎺"];
    return icons[index % icons.length];
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.audio.play();
    this.isPlaying = true;
    this.playPauseBtn.textContent = "⏸";
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.playPauseBtn.textContent = "▶";
  }

  previousSong() {
    this.currentSongIndex =
      (this.currentSongIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadSong(this.currentSongIndex);
    if (this.isPlaying) {
      this.play();
    }
  }

  nextSong() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.playlist.length;
    this.loadSong(this.currentSongIndex);
    if (this.isPlaying) {
      this.play();
    }
  }

  setProgress(e) {
    const width = this.progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = this.audio.duration;
    this.audio.currentTime = (clickX / width) * duration;
  }

  setVolume(e) {
    this.audio.volume = e.target.value / 100;
  }

  updateDuration() {
    const duration = this.audio.duration;
    this.totalTimeEl.textContent = this.formatTime(duration);
    this.songDuration.textContent = `0:00 / ${this.formatTime(duration)}`;
  }

  updateProgress() {
    const { duration, currentTime } = this.audio;
    const progressPercent = (currentTime / duration) * 100;
    this.progress.style.width = `${progressPercent}%`;

    this.currentTimeEl.textContent = this.formatTime(currentTime);
    this.songDuration.textContent = `${this.formatTime(
      currentTime
    )} / ${this.formatTime(duration)}`;
  }

  formatTime(time) {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  handleSongEnd() {
    if (this.autoplay) {
      this.nextSong();
    } else {
      this.isPlaying = false;
      this.playPauseBtn.textContent = "▶";
    }
  }

  renderPlaylist() {
    this.playlistEl.innerHTML = "";
    this.playlist.forEach((song, index) => {
      const item = document.createElement("div");
      item.className = "playlist-item";
      item.innerHTML = `
                        <div class="song-info-small">
                            <div class="song-title-small">${song.title}</div>
                            <div class="song-artist-small">${song.artist}</div>
                        </div>
                    `;
      item.addEventListener("click", () => {
        this.currentSongIndex = index;
        this.loadSong(index);
        if (this.isPlaying) {
          this.play();
        }
      });
      this.playlistEl.appendChild(item);
    });
  }

  updatePlaylistActive() {
    const items = this.playlistEl.querySelectorAll(".playlist-item");
    items.forEach((item, index) => {
      item.classList.toggle("active", index === this.currentSongIndex);
    });
  }

  togglePlaylist() {
    this.playlistVisible = !this.playlistVisible;
    this.playlistEl.style.display = this.playlistVisible ? "block" : "none";
    this.playlistToggle.textContent = this.playlistVisible
      ? "📋 Hide Playlist"
      : "📋 Show Playlist";
  }

  toggleAutoplay() {
    this.autoplay = !this.autoplay;
    this.autoplayToggle.classList.toggle("active", this.autoplay);
  }

  handleKeyPress(e) {
    switch (e.code) {
      case "Space":
        e.preventDefault();
        this.togglePlayPause();
        break;
      case "ArrowLeft":
        this.previousSong();
        break;
      case "ArrowRight":
        this.nextSong();
        break;
      case "ArrowUp":
        e.preventDefault();
        this.volumeSlider.value = Math.min(
          100,
          parseInt(this.volumeSlider.value) + 10
        );
        this.setVolume({ target: this.volumeSlider });
        break;
      case "ArrowDown":
        e.preventDefault();
        this.volumeSlider.value = Math.max(
          0,
          parseInt(this.volumeSlider.value) - 10
        );
        this.setVolume({ target: this.volumeSlider });
        break;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MusicPlayer();
});
