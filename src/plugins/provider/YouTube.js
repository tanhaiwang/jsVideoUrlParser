urlParser.bind({
  'provider': 'youtube',
  'alternatives': ['youtu'],
  'parse': function(url) {
    "use strict";
    var match,
      id,
      playlistId,
      playlistIndex,
      startTime,
      result = {};

    match = url.match(/(?:(?:v|be|videos)\/|v=)([\w\-]{11})/i);
    id = match ? match[1] : undefined;

    match = url.match(/list=([\w\-]+)/i);
    playlistId = match ? match[1] : undefined;

    match = url.match(/index=(\d+)/i);
    playlistIndex = match ? Number(match[1]) : undefined;

    match = url.match(/[#\?&](?:star)?t=([A-Za-z0-9]+)/i);
    startTime = match ? getTime(match[1]) : undefined;

    if (id) {
      result.mediaType = 'video';
      result.id = id;
      if (playlistId) {
        result.playlistId = playlistId;
        if (playlistIndex) {
          result.playlistIndex = playlistIndex;
        }
      }
      if (startTime) {
        result.startTime = startTime;
      }
    } else if (playlistId) {
      result.mediaType = 'playlist';
      result.playlistId = playlistId;
    } else {
      return undefined;
    }

    return result;
  },
  'create': function(op) {
    "use strict";
    var url,
      vi = op.videoInfo;
    if (vi.mediaType === 'playlist') {
      return 'https://www.youtube.com/playlist?feature=share&list={0}'.format(vi.playlistId);
    }

    if (vi.playlistId) {
      url = 'https://www.youtube.com/watch?v={0}&list={1}'.format(vi.id, vi.playlistId);
      if (vi.playlistIndex) {
        url += '&index={0}'.format(vi.playlistIndex);
      }
    } else {
      if (op.format === 'short') {
        url = 'https://youtu.be/{0}'.format(vi.id);
      } else {
        url = 'https://www.youtube.com/watch?v={0}'.format(vi.id);
      }
    }

    if (vi.startTime) {
      url += '#t={0}'.format(vi.startTime);
    }
    return url;
  }
});
