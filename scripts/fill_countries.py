#!/usr/bin/env python3
"""Fetch country info from REST Countries API and fill missing capitals, coordinates and populations in assets/data/countries.json.

Behavior:
- Creates a backup of assets/data/countries.json -> assets/data/countries.json.autofill.bak
- Only replaces placeholder values: capital=="" or population==0 or coordinates lat/long==0
- Keeps IDs and other fields untouched
- Outputs a summary of updates and any unmatched country names
"""
import json
import urllib.request
import os
import sys

ROOT = os.path.join(os.path.dirname(__file__), '..')
DATA_PATH = os.path.join(ROOT, 'assets', 'data', 'countries.json')
BACKUP_PATH = DATA_PATH + '.autofill.bak'

API_URL = 'https://restcountries.com/v3.1/all?fields=name,capital,latlng,population,altSpellings'


def load_local():
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


def download_restcountries():
    print('Downloading REST Countries data...')
    with urllib.request.urlopen(API_URL, timeout=30) as r:
        data = r.read().decode('utf-8')
    return json.loads(data)


def build_lookup(rest):
    lookup = {}
    items = []
    for c in rest:
        names = set()
        try:
            common = c.get('name', {}).get('common', '')
            official = c.get('name', {}).get('official', '')
        except Exception:
            common = c.get('name', '')
            official = ''
        if common: names.add(common.lower())
        if official: names.add(official.lower())
        for alt in c.get('altSpellings', []) or []:
            names.add(alt.lower())

        items.append((c, names))
        for n in names:
            lookup[n] = c

    return lookup, items


def normalize(s):
    if not s:
        return ''
    return ''.join(ch for ch in s.lower() if ch.isalnum() or ch.isspace())


def find_match(name, lookup, items):
    key = name.lower()
    if key in lookup:
        return lookup[key]

    # try normalized matching
    norm_name = normalize(name)
    for c, names in items:
        for candidate in names:
            if normalize(candidate) == norm_name:
                return c

    # try contains or partial matches
    for c, names in items:
        for candidate in names:
            if norm_name in candidate or candidate in norm_name:
                return c

    # some manual mappings for common aliases
    aliases = {
        'united states': 'united states',
        'united states of america': 'united states',
        'russia': 'russia',
        'bolivia': 'bolivia',
        'cabo verde': 'cabo verde',
        "cote d'ivoire": "côte d'ivoire",
        'ivory coast': "côte d'ivoire",
        'vatican city': 'vatican city',
        'korea, south': 'south korea',
        'south korea': 'south korea',
        'korea, north': 'north korea',
    }
    if name.lower() in aliases:
        alias = aliases[name.lower()]
        if alias in lookup:
            return lookup[alias]

    return None


def main():
    local = load_local()

    # backup
    with open(BACKUP_PATH, 'w', encoding='utf-8') as f:
        json.dump(local, f, ensure_ascii=False, indent=2)
    print('Backup written to', BACKUP_PATH)

    rest = download_restcountries()
    lookup, items = build_lookup(rest)

    updated_cnt = 0
    updated_capitals = 0
    updated_coords = 0
    updated_pop = 0
    unmatched = []

    for entry in local:
        name = entry.get('name', '')
        match = find_match(name, lookup, items)
        if not match:
            unmatched.append(name)
            continue

        # capital
        existing_cap = entry.get('capital', '')
        api_cap = ''
        if match.get('capital'):
            api_cap = match['capital'][0] if isinstance(match['capital'], list) and match['capital'] else match['capital']

        if (not existing_cap) and api_cap:
            entry['capital'] = api_cap
            updated_capitals += 1

        # population
        existing_pop = entry.get('population', 0) or 0
        api_pop = match.get('population', 0) or 0
        if existing_pop == 0 and api_pop > 0:
            entry['population'] = api_pop
            updated_pop += 1

        # coordinates
        existing_coords = entry.get('coordinates', {})
        ex_lat = existing_coords.get('latitude', 0)
        ex_lng = existing_coords.get('longitude', 0)
        api_latlng = match.get('latlng') or []
        if (ex_lat == 0 and ex_lng == 0) and len(api_latlng) >= 2:
            entry['coordinates'] = {'latitude': float(api_latlng[0]), 'longitude': float(api_latlng[1])}
            updated_coords += 1

        if existing_cap == '' and existing_pop == 0 and (ex_lat == 0 and ex_lng == 0):
            # we updated something
            if api_cap or api_pop or (len(api_latlng) >= 2):
                updated_cnt += 1

    # write file back
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(local, f, ensure_ascii=False, indent=2)

    print('\nSummary:')
    print('  Total countries processed:', len(local))
    print('  Entries fully updated (was empty fields):', updated_cnt)
    print('  Capitals updated:', updated_capitals)
    print('  Populations updated:', updated_pop)
    print('  Coordinates updated:', updated_coords)
    if unmatched:
        print('\nUnmatched names (need manual check):')
        for n in unmatched:
            print(' -', n)


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        print('Error:', e)
        sys.exit(1)
