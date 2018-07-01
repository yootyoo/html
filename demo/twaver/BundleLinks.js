twaver.BundleLinks = function (links, siblings) {
    this._links = links;
    this._siblings = siblings;

    var i;
    var link;

    var expanded = twaver.Styles.getStyle('link.bundle.expanded');
    for (i = 0; i < links.size(); i++) {
        link = links.get(i);
        var b = link.getStyle('link.bundle.expanded', false);
        if (b != null) {
            expanded = b;
            break;
        }
    }
    if (expanded == null) {
        expanded = true;
    }

    if ($Defaults.LINK_BUNDLE_AGENT_FUNCTION) {
        var agent = $Defaults.LINK_BUNDLE_AGENT_FUNCTION(links);
        if (agent == null) {
            agent = links.get(0);
        } else {
            if (agent != links.get(0)) {
                links.remove(agent);
                links.add(agent, 0);
            }
        }
    }

    for (i = 0; i < links.size(); i++) {
        links.get(i).setStyle('link.bundle.expanded', expanded);
    }
};
_twaver.ext('twaver.BundleLinks', Object, {
    getLinks: function () {
        return this._links;
    },
    getSiblings: function () {
        return this._siblings;
    },
    forEachSiblingLink: function (f, scope) {
        this._siblings.forEach(function (bundleLinks) {
            bundleLinks.getLinks().forEach(f, scope);
        });
    }
});
