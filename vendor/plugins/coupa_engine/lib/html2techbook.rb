# Converts HTML to techbook markup for PDF::Writer
# Based *very much* upon http://blog.yanime.org/articles/2005/10/10/html2text-function-in-ruby

require 'cgi'

module HTML2Techbook
  def self.from_html(html)
    return unless html
    text = html.
      gsub(/(&nbsp;|\n|\s)+/im, ' ').squeeze(' ').strip.
      gsub(/<([^\s]+)[^>]*(src|href)=\s*(.?)([^>\s]*)\3[^>]*>\4<\/\1>/i, '\4')

    links = []
    linkregex = /<[^>]*(src|href)=\s*(.?)([^>\s]*)\2[^>]*>\s*/i
    while linkregex.match(text)
      links << $~[3]
      text.sub!(linkregex, "[#{links.size}]")
    end

    text = CGI.unescapeHTML(
      text.
        gsub(/<(script|style)[^>]*>.*<\/\1>/im, '').
        gsub(/<!--.*-->/m, '').
        gsub(/<hr(| [^>]*)>/i, "___\n").
        gsub(/<([ |\/]*)b[ ]*>/i, '<:\1b>').
        gsub(/<([ |\/]*)i[ ]*>/i, '<:\1i>').
        gsub(/<li(| [^>]*)>/i, "\n<:C:bullet/>").
        gsub(/<blockquote(| [^>]*)>/i, '> ').
        gsub(/<(br)(| [^>]*)>/i, "\n").
        gsub(/<(\/h[\d]+|p)(| [^>]*)>/i, "\n\n").
        gsub(/<[^(>|:)]*>/, '').
        gsub(/<:/, '<')
    ).lstrip.gsub(/\n[ ]+/, "\n") + "\n"

    for i in (0...links.size).to_a
      text = text + "\n  [#{i+1}] <#{CGI.unescapeHTML(links[i])}>" unless links[i].nil?
    end
    links = nil
    text
  end
end
